//OpneCV
#include <opencv2/core/core.hpp>
#include <opencv2/highgui/highgui.hpp>
#include <opencv2/imgproc/imgproc.hpp>

//std:
#include <fstream>
#include <iostream>
#include <string>



// E S E R C I Z I O   1
int myKmeans(int num_iter, int cluster_count, cv::Mat samples, cv::Mat image, cv::Mat& labels, cv::Mat& centers)
{
	//labels contiene il valore dell'indice del cluster di appartnenza
	labels = cv::Mat(image.rows * image.cols, 1, CV_32SC1, cv::Scalar(0));
	//centers contiene gli indici dei cluster e i corrispondenti valori
	centers = cv::Mat(cluster_count, 1, CV_32F);
	//vettore per calcolare la somma degli elementi appartenenti ad un cluster per calcolare i nuovi centri
	std::vector<float> sum_cluster(cluster_count);
	//vettore per contare gli elementi appartenenti ad un cluster per calcolare i nuovi centri
	std::vector<float> count_ele_cluster(cluster_count);

	for(int i=1; i <= cluster_count; i++)
	{
		centers.at<float>(i-1, 0) = i*(250/cluster_count);
		sum_cluster[i-1] = 0;
		count_ele_cluster[i-1] = 0;
		
	}

	float min = 255.00;
	float dist;

	for(int k=0; k<num_iter; k++) //10000
	{
		
		for( int y = 0; y < image.rows; y++ )
			for( int x = 0; x < image.cols; x++ )
			{
				for( int i = 0; i < cluster_count; i++)
				{
					dist = sqrt(pow(samples.at<float>(y + x*image.rows,0) - centers.at<float>(i, 0), 2));
					if(dist < min)
					{
						min = dist;
						labels.at<int>(y + x*image.rows,0) = i;
					}
				}
				
				min = 255.00;
				sum_cluster[labels.at<int>(y + x*image.rows,0)] += samples.at<float>(y + x*image.rows,0);
				count_ele_cluster[labels.at<int>(y + x*image.rows,0)]++;
			}

		for(int i=0; i < cluster_count; i++)
		{
			centers.at<float>(i, 0) = sum_cluster[i] / count_ele_cluster[i];
			sum_cluster[i] = 0;
			count_ele_cluster[i] = 0;
		}
	}

	return 0;

}

// E S E R C I Z I O   2
int myKmeansMaxima(int num_iter, cv::Mat samples, cv::Mat image, cv::Mat& labels, cv::Mat& centers)
{
	//labels contiene il valore dell'indice del cluster di appartnenza
	labels = cv::Mat(image.rows * image.cols, 1, CV_32SC1, cv::Scalar(0));

	//contiene l'istogramma dell'immagine
	int histogram[256] = {0};
	//contiene i massimi locali dell immagine
	std::vector<float> maximum;

	//conteggio dell'istogramma
	for( int y = 0; y < image.rows; y++ )
		for( int x = 0; x < image.cols; x++ )
		{
			histogram[image.at<unsigned char>(y,x)]++;
		}

	//trovo il massimo	
	for(int i=4; i < 256-4; i++)
	{
		if((histogram[i-1] < histogram[i]) && (histogram[i+1] < histogram[i]) && 
		(histogram[i-2] < histogram[i]) && (histogram[i+2] < histogram[i]) &&
		(histogram[i-3] < histogram[i]) && (histogram[i+3] < histogram[i]) &&
		(histogram[i-4] < histogram[i]) && (histogram[i+4] < histogram[i]) && (160 < histogram[i]))
		{
			maximum.push_back(i);
		}
	}

	int num_cluster = maximum.size();

	//centers contiene gli indici dei cluster e i corrispondenti valori
	centers = cv::Mat(num_cluster, 1, CV_32F);
	//vettore per contare gli elementi appartenenti ad un cluster per calcolare i nuovi centri
	std::vector<float> count_ele_cluster(num_cluster);
	//vettore per calcolare la somma degli elementi appartenenti ad un cluster per calcolare i nuovi centri
	std::vector<float> sum_cluster(num_cluster);

	for(int i=0; i < num_cluster; i++)
	{
		//std::cout << maximum[i] << " :: " << histogram[(int)maximum[i]] << std::endl;
		centers.at<float>(i, 0) = maximum[i];
		sum_cluster[i] = 0;
		count_ele_cluster[i] = 0;
	}

	float min = 255.00;
	float dist;

	for(int k=0; k<num_iter; k++) //10000
	{
		
		for( int y = 0; y < image.rows; y++ )
			for( int x = 0; x < image.cols; x++ )
			{
				for( int i = 0; i < num_cluster; i++)
				{
					dist = sqrt(pow(samples.at<float>(y + x*image.rows,0) - centers.at<float>(i, 0), 2));
					if(dist < min)
					{
						min = dist;
						labels.at<int>(y + x*image.rows,0) = i;
					}
				}
				
				min = 255.00;
				sum_cluster[labels.at<int>(y + x*image.rows,0)] += samples.at<float>(y + x*image.rows,0);
				count_ele_cluster[labels.at<int>(y + x*image.rows,0)]++;
			}

		for(int i=0; i < num_cluster; i++)
		{
			centers.at<float>(i, 0) = sum_cluster[i] / count_ele_cluster[i];
			sum_cluster[i] = 0;
			count_ele_cluster[i] = 0;
		}
	}

	return 0;

}




struct ArgumentList {
	std::string image_name;		    //!< image file name
	int wait_t;                     //!< waiting time
};

bool ParseInputs(ArgumentList& args, int argc, char **argv) {

	if(argc<3 || (argc==2 && std::string(argv[1]) == "--help") || (argc==2 && std::string(argv[1]) == "-h") || (argc==2 && std::string(argv[1]) == "-help"))
	{
		std::cout<<"usage: simple -i <image_name>"<<std::endl;
		std::cout<<"exit:  type q"<<std::endl<<std::endl;
		std::cout<<"Allowed options:"<<std::endl<<
				"   -h	                     produce help message"<<std::endl<<
				"   -i arg                   image name. Use %0xd format for multiple images."<<std::endl<<
				"   -t arg                   wait before next frame (ms) [default = 0]"<<std::endl<<std::endl<<std::endl;
		return false;
	}

	int i = 1;
	while(i<argc)
	{
		if(std::string(argv[i]) == "-i") {
			args.image_name = std::string(argv[++i]);
		}

		if(std::string(argv[i]) == "-t") {
			args.wait_t = atoi(argv[++i]);
		}
		else
			args.wait_t = 0;

		++i;
	}

	return true;
}

int main(int argc, char **argv)
{
	int frame_number = 0;
	char frame_name[256];
	bool exit_loop = false;

	std::cout<<"Simple program."<<std::endl;

	//////////////////////
	//parse argument list:
	//////////////////////
	ArgumentList args;
	if(!ParseInputs(args, argc, argv)) {
		return 1;
	}

	while(!exit_loop)
	{
		//generating file name
		//
		//multi frame case
		if(args.image_name.find('%') != std::string::npos)
			sprintf(frame_name,(const char*)(args.image_name.c_str()),frame_number);
		else //single frame case
			sprintf(frame_name,"%s",args.image_name.c_str());

		//opening file
		std::cout<<"Opening "<<frame_name<<std::endl;

		cv::Mat image = cv::imread(frame_name, cv::IMREAD_GRAYSCALE );
		if(image.empty())
		{
			std::cout<<"Unable to open "<<frame_name<<std::endl;
			return 1;
		}

		//////////////////////////////////////
		//K MEANS
		//
		int cluster_count = 5;

		cv::Mat samples(image.rows * image.cols, 1, CV_32F);
		for( int y = 0; y < image.rows; y++ )
			for( int x = 0; x < image.cols; x++ )
				//for( int z = 0; z < image.channels(); z++)
					samples.at<float>(y + x*image.rows, 0) = image.at<unsigned char>(y,x);

		cv::Mat labels;
		int attempts = 5;
		cv::Mat centers;
		//ES2
		cv::Mat labels2;
		cv::Mat centers2;

		//ESERCIZIO 1
		myKmeans(200, cluster_count, samples, image, labels, centers);

		//ESERCIZIO 2
		myKmeansMaxima(200, samples, image, labels2, centers2);

		//
		//OpenCv
		//cv::kmeans(samples, (cluster_count==0)?1:cluster_count, labels, cv::TermCriteria(CV_TERMCRIT_ITER|CV_TERMCRIT_EPS, 10000, 0.0001), attempts, cv::KMEANS_PP_CENTERS, centers );
		//
		//


		cv::Mat new_image( image.size(), image.type() );
		for( int y = 0; y < image.rows; y++ )
			for( int x = 0; x < image.cols; x++ )
			{
				//Da convertire per immagine ad un canale
				int cluster_idx = labels.at<int>(y + x*image.rows,0);
				new_image.at<unsigned char>(y,x) = centers.at<float>(cluster_idx, 0);
				/*new_image.at<cv::Vec3b>(y,x)[1] = centers.at<float>(cluster_idx, 1);
				new_image.at<cv::Vec3b>(y,x)[2] = centers.at<float>(cluster_idx, 2);*/
			}
		cv::namedWindow("clustered image", cv::WINDOW_NORMAL);
		cv::imshow( "clustered image", new_image );

		//------ES2
		//-----
		cv::Mat new_image2( image.size(), image.type() );
		for( int y = 0; y < image.rows; y++ )
			for( int x = 0; x < image.cols; x++ )
			{
				//Da convertire per immagine ad un canale
				int cluster_idx = labels2.at<int>(y + x*image.rows,0);
				new_image2.at<unsigned char>(y,x) = centers2.at<float>(cluster_idx, 0);
				/*new_image.at<cv::Vec3b>(y,x)[1] = centers.at<float>(cluster_idx, 1);
				new_image.at<cv::Vec3b>(y,x)[2] = centers.at<float>(cluster_idx, 2);*/
			}
		cv::namedWindow("clustered image maxima", cv::WINDOW_NORMAL);
		cv::imshow( "clustered image maxima", new_image2 );


		//////////////////////////////////////////



		/////////////////////
		//display image
		cv::namedWindow("image", cv::WINDOW_NORMAL);
		cv::imshow("image", image);

		//wait for key or timeout
		unsigned char key = cv::waitKey(args.wait_t);
		std::cout<<"key "<<int(key)<<std::endl;

		//here you can implement some looping logic using key value:
		// - pause
		// - stop
		// - step back
		// - step forward
		// - loop on the same frame
		if(key == 'q')
			exit_loop = true;

		frame_number++;
	}

	return 0;
}
