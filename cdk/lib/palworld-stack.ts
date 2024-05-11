import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { aws_s3, aws_ec2, aws_ecs_patterns, aws_ecs } from 'aws-cdk-lib';

export class PalwordStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = new aws_ec2.Vpc(this, 'palworld', {
      vpcName: 'palworld',
      maxAzs: 3,
      enableDnsHostnames: true,
      enableDnsSupport: true,
      ipAddresses: aws_ec2.IpAddresses.cidr('10.0.0.0/16'),
      restrictDefaultSecurityGroup: true,
      subnetConfiguration: [
        {
          cidrMask: 24,
          name: 'public',
          subnetType: aws_ec2.SubnetType.PUBLIC,
        },
        {
          cidrMask: 24,
          name: 'application',
          subnetType: aws_ec2.SubnetType.PRIVATE_WITH_EGRESS,
        },
      ],
    });

    const gameSecurityGroup = new aws_ec2.SecurityGroup(this, 'palworld-ecs', {
      vpc,
    });

    const gameFargateService = new aws_ecs_patterns.NetworkLoadBalancedFargateService(this, 'palworld', {
      vpc,
      desiredCount: 1,
      publicLoadBalancer: true,
      cpu: 4,
      memoryLimitMiB: 32768, // 32GB
      taskImageOptions: {
        image: aws_ecs.ContainerImage.fromRegistry('thijsvanloef/palworld-server-docker'),
      },
      securityGroups: [gameSecurityGroup],
      taskSubnets: vpc.selectSubnets({
        subnetType: aws_ec2.SubnetType.PRIVATE_WITH_EGRESS,
      }),
    });

    // const backupBucket = new s3.Bucket(this, 'palworld-backups', {
    //   blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
    //   encryption: s3.BucketEncryption.S3_MANAGED,
    //   removalPolicy: cdk.RemovalPolicy.DESTROY,
    //   autoDeleteObjects: true,
    //   versioned: true,
    //   objectOwnership: s3.ObjectOwnership.BUCKET_OWNER_ENFORCED,
    // });
  }
}
