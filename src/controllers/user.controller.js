import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiError } from '../utils/ApiError.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import { User } from '../models/user.model.js'
import { uploadOnCloudinary } from '../utils/cloudinary.js'

const registerUser = asyncHandler(async (req, res) => {

    // step - 1
    // get user from frontend
    const { fullname, email, username, password } = req.body
    console.log('email', email);

    // step - 2
    // validation - not empty
    if ([fullname, email, username, password].some((field) => field?.trim() === '')) {
        throw new ApiError(400, 'All fields are required')
    }

    // step - 3
    // check if user already exist: email, username
    const existedUser = User.findOne({
        $or: [{ email }, { username }]
    })
    if (existedUser) {
        throw new ApiError(409, 'User with email or password already exists')
    }

    // step - 4
    // check for images, check for avatar
    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;

    if (!avatarLocalPath) {
        throw new ApiError(400, 'Avatar file is required')
    }

    // step - 5
    // upload them to cloudinary, avatar
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    if (!avatar) {
        throw new ApiError(400, 'Avatar file is required')
    }

    // step - 6
    // create user object, create entry in db
    const user = await User.create({
        fullname: fullname,
        username: username.toLowerCase(),
        email,
        password,
        avatar: avatar.url,
        coverImage: coverImage?.url || ''
    })

    // step - 7
    // remove password and refresh token field from response
    const createdUser = await User.findById(user._id).select('-password -refreshToken')

    // step - 8
    // check user creation
    if (!createdUser) {
        throw new ApiError(500, 'Something went wrong while registering the user');
    }

    // step - 9
    // return response
    return res.status(201).json(
        new ApiResponse(200, createdUser, 'User Registered successfully')
    )

});

export { registerUser }