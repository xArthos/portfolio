export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };

/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
    ObjectId: string;
    String: string;
    Boolean: boolean;
    Int: number;
    Float: number;
};

export type Mutation = {
    __typename?: 'Mutation';
    addUser: User;
};

export type MutationAddPlaceArgs = {
    body?: InputMaybe<InputPlaceType>;
};

export type MutationAddReviewArgs = {
    body?: InputMaybe<InputReviewType>;
};

export type MutationAddUserArgs = {
    body?: InputMaybe<InputUserType>;
};

export type Query = {
    __typename?: 'Query';
    reviewByUser?: Maybe<Array<Maybe<Review>>>;
    user: User;
    userList: Array<User>;
};

export type QueryPlaceArgs = {
    _id?: InputMaybe<Scalars['ObjectId']>;
};

export type QueryReviewByUserArgs = {
    _id?: InputMaybe<Scalars['ObjectId']>;
};

export type QueryUserArgs = {
    _id: Scalars['ObjectId'];
};

export type Review = {
    __typename?: 'Review';
    author?: Maybe<User>;
    feedback?: Maybe<Scalars['String']>;
    _id?: Maybe<Scalars['ObjectId']>;
    place?: Maybe<Scalars['ObjectId']>;
    rate?: Maybe<Scalars['Float']>;
};

export type User = {
    __typename?: 'User';
    email: Scalars['String'];
    _id: Scalars['ObjectId'];
    name?: Maybe<Scalars['String']>;
    photo: Scalars['String'];
};

export type InputPlaceType = {
    description?: InputMaybe<Scalars['String']>;
    mainPhoto?: InputMaybe<Scalars['String']>;
    photos?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
    priceByNight?: InputMaybe<Scalars['Float']>;
    type?: InputMaybe<Scalars['String']>;
};

export type InputReviewType = {
    feedback?: InputMaybe<Scalars['String']>;
    _id?: InputMaybe<Scalars['ObjectId']>;
    place?: InputMaybe<Scalars['ObjectId']>;
    rate?: InputMaybe<Scalars['Float']>;
};

export type InputUserType = {
    email: Scalars['String'];
    name: Scalars['String'];
};