import Text.Read
import Data.Maybe

recTriangle = [(a,b,c) | c<-[1..100], b <- [1..c], a<-[1..b], a^2+b^2 == c^2, a+b+c == 24]

removeUpperCase :: [Char] -> [Char]
removeUpperCase xs = [x | x <- xs, elem x ['a'..'z']]

factorial :: Integer -> Integer
factorial n = product [1..n]

--division :: Float -> Float -> Float
division :: (Fractional a) => a -> a -> a
division a b = a / b

prPat :: Integer -> [Char]
prPat 3 = "Stardust Crusaiders"
prPat 4 = "Diamond is Unbreakable"
prPat x = "All Other Parts"

--data Shape = Circle Float Float Float | Rectangle Float Float Float Float deriving Show

--surface :: Shape -> Float
--surface (Circle _ _ r) = pi * r ^ 2
--surface (Rectangle x1 y1 x2 y2) = (abs $ x2 - x1) * (abs $ y2 - y1) 

data Point = Point Float Float deriving Show
data Shape = Circle Point Float | Rectangle Point Point deriving Show

surface :: Shape -> Float
surface (Circle _ r) = pi * r ^ 2
surface (Rectangle (Point x1 y1) (Point x2 y2)) = (abs $ x2 - x1) * (abs $ y2 - y1) 



nudge :: Shape -> Float -> Float -> Shape  
nudge (Rectangle (Point x1 y1) (Point x2 y2)) a b = Rectangle (Point (x1+a) (y1+b)) (Point (x2+a) (y2+b))  


--data Person = Person String String Int Float String String deriving Show

--kj = (Person "Kujo" "Jotaro" 17 1.98 "333333333" "Dolphin")

firstName' :: Person -> String
firstName' (Person name _ _ _ _ _) = name

lastName' :: Person -> String
lastName' (Person _ name _ _ _ _) = name

data Person = Person { firstName :: String,
                        lastName :: String,
                        age :: Int,
                        height :: Float,
                        number :: String,
                        stand :: String} deriving (Show, Eq, Read)

kj = (Person "Kujo" "Jotaro" 17 1.98 "333333333" "Star Platinum")

data List a = Empty | Cons { listHead :: a, listTail :: List a} deriving (Show, Read, Eq, Ord)

data Tree a = EmptyTree | Node a (Tree a) (Tree a) deriving (Show, Read, Eq)

singleton :: a -> Tree a
-- just a shortcut f.
singleton x = Node x EmptyTree EmptyTree

treeInsert :: (Ord a) => a -> Tree a -> Tree a
treeInsert x EmptyTree = singleton x
treeInsert x (Node a left right)
    | x == a = Node x left right
    | x < a = Node a (treeInsert x left) right
    | x > a = Node a left (treeInsert x right)


instance Functor Tree where
    fmap f EmptyTree = EmptyTree
    fmap f (Node a left right) = (Node (f a) (fmap f left) (fmap f right))