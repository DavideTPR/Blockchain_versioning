#include <iostream>
#include <eigen3/Eigen/Dense>

template <typename T>
void MakeRx(T rx, Eigen::Matrix<T, 3, 3>& Rx)
{
  T cx = cos(rx);
  T sx = sin(rx);
  Rx << 1.0, 0.0, 0.0,
	0.0,  cx, -sx,
	0.0,  sx,  cx;
}

template <typename T>
void MakeRy(T ry, Eigen::Matrix<T, 3, 3>& Ry)
{
  T cy = cos(ry);
  T sy = sin(ry);
  Ry <<  cy, 0.0,  sy,
	0.0, 1.0, 0.0,
	-sy, 0.0,  cy;
}

template <typename T>
void MakeRz(double rz, Eigen::Matrix<T, 3, 3>& Rz)
{
  T cz = cos(rz);
  T sz = sin(rz);
  Rz <<  cz, -sz, 0.0,
	 sz,  cz, 0.0,
	0.0, 0.0, 1.0;
}

template <typename T>
void MakeR(T rx, T ry, T rz, Eigen::Matrix<T, 3, 3>& R)
{
  Eigen::Matrix<T, 3, 3> Rx, Ry, Rz;
  MakeRx(rx, Rx);
  MakeRy(ry, Ry);
  MakeRz(rz, Rz);
  R = Rz * Ry * Rx;
}

template <typename T>
void MakeTr(T rx, T ry, T rz, T tx, T ty, T tz, Eigen::Matrix<T, 4, 4>& Tr)
{
  Eigen::Matrix<T, 3, 3> R;
  MakeR(rx, ry, rz, R);
  Tr.block(0,0,3,3) = R;
  Eigen::Matrix<T, 3, 1> t;
  t << tx, ty, tz;
  Tr.block(0,3,3,1) = t;
  Tr.block(3,0,1,3) = Eigen::Matrix<T, 1, 3>::Zero();
  Tr.block(3,3,1,1) = Eigen::Matrix<T, 1, 1>::Ones();
}

template <typename T>
void MakeIPM(const Eigen::Matrix<T, 3, 4> P, T a, T b, T c, T d, Eigen::Matrix<T, 4, 4>& IPM)
{
  Eigen::Matrix<T, 4, 4> A;
  A.block(0,0,3,4) = P;
  Eigen::Matrix<T, 1, 4> p;
  p << a, b, c, d;
  A.block(3,0,1,4) = p;
  IPM = A.inverse().eval();
}

template <typename T, int rows>
void Euclidean(Eigen::Matrix<T, rows, 1>& v) 
{
    for (int i = 0; i < rows; ++i)
    {
      v(i,0) = v(i,0)/v(rows-1,0);
    }
}