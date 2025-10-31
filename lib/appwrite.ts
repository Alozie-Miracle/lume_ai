import { Client, Storage } from "appwrite";

export const client = new Client();

client
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!); // Replace with your project ID

export const storage = new Storage(client);

export { ID } from "appwrite";
