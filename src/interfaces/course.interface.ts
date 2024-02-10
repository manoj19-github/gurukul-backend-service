export interface IUploadCourse {
	name: string;
	description: string;
	price: number;
	estimatedPrice: number;
	thumbnail: string;
	tags: string;
	level: string;
	demoUrl: string;
	benefits: { title: string }[];
	prerequists: { title: string }[];
	videoURL: string;
	videoThumbnail: string;
	title: string;
	videoSection: string;
	videoPlayer: string;
	videoLength: number;
}
