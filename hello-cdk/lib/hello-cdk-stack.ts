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

    const repository = ecr.Repository.fromRepositoryName(
      this,
      'AstroRepo',
      'astro-blog-repository'
    );

    const taskDef = new ecs.FargateTaskDefinition(this, 'AstroTask', {
      cpu: 256,
      memoryLimitMiB: 512,
    });

    const container = taskDef.addContainer('AstroContainer', {
      image: ecs.ContainerImage.fromEcrRepository(repository, 'v1.0.0'),
      logging: ecs.LogDriver.awsLogs({ streamPrefix: 'astro' }),
      environment: {
        HOST: '0.0.0.0',
        PORT: '4321',
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

    listener.addTargets('AstroTargets', {
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
      description: 'Public URL for the Astro SSR blog',
    });
  }
}
