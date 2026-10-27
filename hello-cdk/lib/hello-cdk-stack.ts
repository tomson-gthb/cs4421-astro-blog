import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as ecr from 'aws-cdk-lib/aws-ecr';
import * as elbv2 from 'aws-cdk-lib/aws-elasticloadbalancingv2';

export class HelloEcsStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, 'AstroVpc', { 
      maxAzs: 2,
      natGateways: 0, 
      subnetConfiguration: [
        {
          cidrMask: 24,
          name: 'public',
          subnetType: ec2.SubnetType.PUBLIC, 
        }
      ]
    });

    const cluster = new ecs.Cluster(this, 'AstroCluster', { vpc });

    const repo = new ecr.Repository(this, 'AstroRepo', {
      repositoryName: 'astro-blog-repository',
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      emptyOnDelete: true,
    });

    repo.addLifecycleRule({
      maxImageCount: 3,
      description: 'Retain only the 3 most recent container versions to optimize AWS storage expenses',
    });

    const taskDef = new ecs.FargateTaskDefinition(this, 'AstroTask', {
      cpu: 256,
      memoryLimitMiB: 512,
    });

    repo.grantPull(taskDef.obtainExecutionRole());

    const imageTag = this.node.tryGetContext('imageTag') || 'latest';
    const container = taskDef.addContainer('AstroContainer', {
      image: ecs.ContainerImage.fromEcrRepository(repo, imageTag),
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
      assignPublicIp: true, // Required for public subnets so tasks can fetch packages
      healthCheckGracePeriod: cdk.Duration.seconds(60),
      minHealthyPercent: 100, 
      maxHealthyPercent: 200,     
      circuitBreaker: { rollback: true },
      vpcSubnets: { subnetType: ec2.SubnetType.PUBLIC }
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
        path: '/api/health', 
        protocol: elbv2.Protocol.HTTP,
        port: '4321',
        healthyHttpCodes: '200', 
        interval: cdk.Duration.seconds(15),
        timeout: cdk.Duration.seconds(5),
        healthyThresholdCount: 2,
        unhealthyThresholdCount: 2,
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

