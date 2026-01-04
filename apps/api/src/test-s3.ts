import dotenv from "dotenv";
import path from "path";
import { S3Client, ListBucketsCommand, PutObjectCommand } from '@aws-sdk/client-s3';

dotenv.config({ path: path.resolve(__dirname, "../../../.env.local") });


const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY!,
    secretAccessKey: process.env.AWS_SECRET_KEY!
  }
});

async function testS3() {
  try {
    // Test 1: List buckets
    console.log('Testing S3 connection...');
    const listCommand = new ListBucketsCommand({});
    const buckets = await s3.send(listCommand);
    console.log('✅ Connected! Your buckets:', buckets.Buckets?.map(b => b.Name));

    // Test 2: Upload a test file
    console.log('\nTesting file upload...');
    const putCommand = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET!,
      Key: 'test-file.txt',
      Body: 'Hello from Bulbul!',
      ContentType: 'text/plain'
    });
    await s3.send(putCommand);
    console.log('✅ File uploaded successfully to bucket:', process.env.S3_BUCKET);
    
  } catch (error) {
    console.error('❌ S3 test failed:', error);
  }
}

testS3();