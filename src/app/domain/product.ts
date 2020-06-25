import { Image } from './image';

export interface Product {
    id: string;
    name: string;
    price: number;
    description: string;
    productStatus: string;
    coverImage: Image
    images: Image[];
}