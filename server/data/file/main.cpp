// std
#include <iostream>
#include <fstream>

// opencv
#include <opencv2/core/core.hpp>
#include <opencv2/calib3d/calib3d.hpp>
#include <opencv2/highgui.hpp>

// eigen
#include <eigen3/Eigen/Core>

// utils
#include "utils.h"
// 
using namespace std;
using namespace cv;
using namespace Eigen;

struct CameraParams
{
    // size
    int w, h;
    // intrinsics
    double ku, kv;
    double u0, v0;
    // estrinsics
    double rx, ry, rz;
    double tx, ty, tz;
    
};

void LoadCameraParams(const std::string& filename, CameraParams& params)
{
    std::ifstream file;
    file.open(filename.c_str());
    
    file >> params.w >> params.h;
    
    file >> params.ku >> params.kv;
    file >> params.u0 >> params.v0;
    
    file >> params.rx >> params.ry >> params.rz;
    file >> params.tx >> params.ty >> params.tz;
    
}

/*void MakeTr(double rx,double ry,double rz,double tx,double ty,double tz,Matrix4d& RT)
{
    //RT = Matrix<double, 4, 4>;
    RT << rx, 0, 0, tx,
          0, ry, 0, ty,
          0, 0, rz, tz,
          0, 0, 0, 1;
}*/


int main(int argc, char **argv) {
    
    if (argc < 3) 
    {
        std::cerr << "Usage lab5_2 <image_filename> <camera_params_filename>" << std::endl; 
        return 0;
    }
    
    // output image
    Mat ipm_image(Size(400, 400), CV_8UC3, Scalar(0, 0, 0));
    
    // load image from file
    Mat input;
    input = imread(argv[1]);
    
    namedWindow("Input", WINDOW_AUTOSIZE );
    imshow("Input", input);
    waitKey(10);
    
    // load camera params
    CameraParams params;
    LoadCameraParams(argv[2], params);
    
    Matrix<double, 3, 4> K;
    K << params.ku,       0.0, params.u0, 0.0,
               0.0, params.kv, params.v0, 0.0,
               0.0,       0.0,       1.0, 0.0;
               
    Matrix4d RT;
    /*RT << params.rx, 0, 0,params.tx,
          0, params.ry, 0, params.ty,
          0, 0, params.rz, params.tz,
          0, 0, 0, 1;*/
    MakeTr(params.rx, params.ry, params.rz, params.tx, params.ty, params.tz, RT);

    /*
     * YOUR CODE HERE: Choose a planar constraint and realize an inverse perspective mapping
     * 1) compute the perspective matrix P
     * 2) choose a planar constraint (ex. z=0) to be used during the inverse perspective mapping
     * 3) compute the inverse perspective matrix corresponding to the chosen constraint
     * 4) realize the inverse perspective mapping
     */ 

   // Matrix<double, K.rows()+RT.rows()+1, K.cols()+RT.cols()+1> M;
   Matrix<double, 3,4> M = K * RT;

   Matrix3d tmp;
   tmp << M(0,0), M(0,1), M(0,3),
          M(1,0), M(1,1), M(1,3),
          M(2,0), M(2,1), M(2,3);

    Matrix3d IPM;
    IPM = tmp.inverse();

    for(int r = 0; r < image.rows; r++)
    {
        for(int c = 0; c < image.cols; c++)
        {
            
        }
    }

       
    namedWindow("IPM", CV_WINDOW_AUTOSIZE );
    imshow("IPM", ipm_image);
    
    std::cout << "Press any key to quit" << std::endl;
    
    waitKey(0);
    
    return 0;
}
