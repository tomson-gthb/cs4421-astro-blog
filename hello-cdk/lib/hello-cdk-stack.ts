import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';

//this is for ecs stack

import { Construct } from 'constructs';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as ecsp from 'aws-cdk-lib/aws-ecs-patterns';
import * as ecr from 'aws-cdk-lib/aws-ecr'; // Make sure to import ECR

export class HelloEcsStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // 1. Look up your existing ECR repository
    const repository = ecr.Repository.fromRepositoryName(this, 'AstroRepo', 'astro-blog-repository');

    new ecsp.ApplicationLoadBalancedFargateService(this, 'MyWebServer', {
      taskImageOptions: {
        // 2. Use your custom ECR image and version tag
        image: ecs.ContainerImage.fromEcrRepository(repository, 'v1.0.0'),
        // 3. Set your Astro port
        containerPort: 4321,
      },
      publicLoadBalancer: true,
    });
  }
}




// this is static site stack.

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

