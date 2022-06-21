export interface ImageBBResponse {
  data: {
    image: {
      extension: string;
      url: string;
    };
    thumb: {
      url: string;
    };
  };
  status: number;
  success: boolean;
}
