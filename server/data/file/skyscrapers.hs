vals = [3,1,4,2,5,7,6] :: [Int]

rooftops :: [Int] -> Int -> Int -> Int
rooftops [] count m = count
rooftops (x:xs) count m
    | x > m = rooftops xs (count + 1) x
    | otherwise = rooftops xs count m

--tetti :: [Int] -> Int
--tetti [x] = 0
--tetti x:xs = ((if x > (head xs) then 1 else 0) + (tetti x:(tail xs)))
--rooftops :: [Int] -> Int
--rooftops [] count m = count
--rooftops (x:xs) count m =

--con foldl
--tetti :: [a]->b
tetti x = fst (foldl (\(a1,a2) x -> if x > a2 then (a1+1, x) else (a1,a2)) (0,0) x)