interface User {
  _id: string;
  fullname: string;
  email: string;
  password: string;
  createdAt: string;
  updatedAt: string;
  pdfs?: Pdf[]; // Optional array of PDFs associated with the user
}

interface Pdf {
  _id: string;
  name: string;
  url: string;
  size: string;
  appwriteId: string;
  user: User; // Reference to User ID
  createdAt: string;
  updatedAt: string;
}

type Message = {
  _id: string;
  userId: string;
  pdfId: string;
  chatId?: string;
  message: string;
  audioAppwriteId?: string;
  createdAt: string;
};

type Chat = {
  _id: string;
  userId: string;
  pdfId: string;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
};
