import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as ecr from 'aws-cdk-lib/aws-ecr';
import * as elbv2 from 'aws-cdk-lib/aws-elasticloadbalancingv2';

export class HelloEcsStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, 'AstroVpc', { maxAzs: 2 });
    const cluster = new ecs.Cluster(this, 'AstroCluster', { vpc });

    const repo = ecr.Repository.fromRepositoryName(
      this,
      'AstroRepo',
      'astro-blog-repository'
    );

    const taskDef = new ecs.FargateTaskDefinition(this, 'AstroTask', {
      cpu: 256,
      memoryLimitMiB: 512,
    });

    const container = taskDef.addContainer('AstroContainer', {
      image: ecs.ContainerImage.fromEcrRepository(repo, 'v1.0.0'),
      logging: ecs.LogDriver.awsLogs({ streamPrefix: 'astro' }),
      environment: {
        HOST: '0.0.0.0',
        PORT: '4321',
	OPENWEATHER_API_KEY: process.env.OPENWEATHER_API_KEY || '',
      },
    });

    container.addPortMappings({ containerPort: 4321 });

    const service = new ecs.FargateService(this, 'AstroService', {
      cluster,
      taskDefinition: taskDef,
      desiredCount: 1,
      assignPublicIp: true,
      healthCheckGracePeriod: cdk.Duration.seconds(60),
    });

    const alb = new elbv2.ApplicationLoadBalancer(this, 'AstroALB', {
      vpc,
      internetFacing: true,
    });

    const listener = alb.addListener('HttpListener', {
      port: 80,
    });
    const targetGroup = listener.addTargets('AstroTargets', {
      port: 4321,
      protocol: elbv2.ApplicationProtocol.HTTP,
      targets: [
        service.loadBalancerTarget({
          containerName: container.containerName,
          containerPort: 4321,
        }),
      ],
      healthCheck: {
        path: '/',
        protocol: elbv2.Protocol.HTTP,
        port: '4321',
        healthyHttpCodes: '200,301,302,307,308',
        interval: cdk.Duration.seconds(30),
        timeout: cdk.Duration.seconds(5),
        healthyThresholdCount: 2,
        unhealthyThresholdCount: 3,
      },
    });


    service.connections.allowFrom(
      alb,
      ec2.Port.tcp(4321),
      'Allow ALB to Astro'
    );

    new cdk.CfnOutput(this, 'BlogURL', {
      value: `http://${alb.loadBalancerDnsName}`,
    });
  }
}



// this is static site stack.
/*
export class StaticSiteStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const siteBucket = new s3.Bucket(this, 'SiteBucket', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    // CloudFront Function to append index.html to clean Astro directory URLs
    const rewriteFunction = new cloudfront.Function(this, 'RewriteFunction', {
      code: cloudfront.FunctionCode.fromInline(`
        function handler(event) {
          var request = event.request;
          var uri = request.uri;
          
          // Check whether the URI is missing a file extension.
          if (uri.endsWith('/')) {
            request.uri += 'index.html';
          } else if (!uri.includes('.')) {
            request.uri += '/index.html';
          }
          
          return request;
        }
      `),
    });


    const distribution = new cloudfront.Distribution(this, 'SiteDistribution', {
      defaultBehavior: { origin: origins.S3BucketOrigin.withOriginAccessControl(siteBucket),
	functionAssociations: [{
          function: rewriteFunction,
          eventType: cloudfront.FunctionEventType.VIEWER_REQUEST,
        }],
	},
      defaultRootObject: 'index.html',
    });
   
     //this is for solving site url visibility after deployment
    new cdk.CfnOutput(this, 'AstroSiteUrl', {
      value: distribution.distributionDomainName,
      description: 'The public URL of your Astro static site',
    });

  new s3deploy.BucketDeployment(this, 'DeploySite', {
    sources: [s3deploy.Source.asset('./../dist')],
    destinationBucket: siteBucket,
    distribution,
    distributionPaths: ['/*'], // Automatic CloudFront CDN cache invalidation!
  });
  }
}
*/
