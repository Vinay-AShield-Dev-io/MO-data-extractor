import { BlobServiceClient, StorageSharedKeyCredential } from '@azure/storage-blob';
import { BLOB_CREDENTIALS } from '../../config/config';

export class BlobStorage {
    private accountName = "";
    private accountKey = "";
    private containerName = "";
    private blobName = "";
    constructor() {
        this.accountName = BLOB_CREDENTIALS.accountName
        this.accountKey = BLOB_CREDENTIALS.accountKey
        this.containerName = BLOB_CREDENTIALS.containerName
        this.blobName = BLOB_CREDENTIALS.blobName
    }
    upladBlob = (content: string) => {
        // Create a StorageSharedKeyCredential object with your storage account and account key
        const sharedKeyCredential = new StorageSharedKeyCredential(this.accountName, this.accountKey);

        // Create a BlobServiceClient using the StorageSharedKeyCredential
        const blobServiceClient = new BlobServiceClient(`https://${this.accountName}.blob.core.windows.net`, sharedKeyCredential);

        // Get a reference to a container
        const containerClient = blobServiceClient.getContainerClient(this.containerName);

        // Get a reference to a blob
        const blockBlobClient = containerClient.getBlockBlobClient(this.blobName);

        // Upload a blob from a string
        blockBlobClient.upload(content, content.length).then((uploadBlobResponse) => {

            console.log(`Blob "${this.blobName}" is uploaded with status code: ${uploadBlobResponse._response.status}`);
        })

    }
}