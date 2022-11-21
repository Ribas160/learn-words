<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{

    public function signUp(Request $request)
    {
        $fields = $request->toArray();

        $validator = Validator::make($fields, [
            'name' => 'required|string',
            'email' => 'required|string|unique:users,email',
            'password' => 'required|string|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $userModel = new User();

        $user = $userModel->createUser([
            'name' => $fields['name'],
            'email' => $fields['email'],
            'password' => bcrypt($fields['password']),
        ]);

        $token = $user->createToken('authtoken')->plainTextToken;

        $response = [
            'user' => $user,
            'token' => $token,
        ];

        return response()->json($response, 201);
    }


    public function signIn(Request $request)
    {
        $fields = $request->toArray();

        $validator = Validator::make($fields, [
            'email' => 'required|string',
            'password' => 'required|string'
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        // Check email
        $user = User::where('email', $fields['email'])->first();

        // Check password
        if(!$user || !Hash::check($fields['password'], $user->password)) {
            return response([
                'message' => 'Invalid email or password',
            ], 401);
        }

        $token = $user->createToken('authtoken')->plainTextToken;

        $response = [
            'user' => $user,
            'token' => $token
        ];

        return response()->json($response, 201);
    }


    public function logOut(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(["message" => "Logged out"], 201);
    }

    
    public function ping()
    {
        return response()->json(["message" => "Pong"], 200);
    }
}
