<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class AuthControllerTest extends TestCase
{
    use RefreshDatabase, WithFaker;


    public function testSignUp(): void
    {
        $password = $this->faker()->password();

        $response = $this->post("/api/sign-up", [
            "name" => $this->faker()->name(),
            "email" => $this->faker()->email(),
            "password" => $password,
            "password_confirmation" => $password,
        ]);

        $response->assertStatus(201);
    }


    public function testSignInSuccess(): void 
    {
        $email = $this->faker()->email();
        $password = $this->faker()->password();

        $signUp = $this->post("/api/sign-up", [
            "name" => $this->faker()->name(),
            "email" => $email,
            "password" => $password,
            "password_confirmation" => $password,
        ]);
        $data = json_decode($signUp->getContent());

        $response = $this->withHeaders([
            "Authorization" => "Bearer $data->token",

        ])->post("/api/sign-in", [
            "email" => $email,
            "password" => $password,
        ]);

        $response->assertStatus(201);
    }


    public function testLogOut(): void 
    {
        $password = $this->faker()->password();

        $signUp = $this->post("/api/sign-up", [
            "name" => $this->faker()->name(),
            "email" => $this->faker()->email(),
            "password" => $password,
            "password_confirmation" => $password,
        ]);
        $data = json_decode($signUp->getContent());

        $response = $this->withHeaders([
            "Authorization" => "Bearer $data->token",

        ])->post("/api/logOut");

        $response->assertStatus(201);
    }


    public function testPermissionDenied(): void 
    {
        $response = $this->get("/api/lists");

        $response->assertStatus(403);
    }


    public function testNotFound(): void
    {
        $response = $this->get("/api/test");

        file_put_contents("tmp.txt", $response->content());

        $response->assertStatus(404);
    }


    public function testPing(): void 
    {
        $password = $this->faker()->password();

        $signUp = $this->post("/api/sign-up", [
            "name" => $this->faker()->name(),
            "email" => $this->faker()->email(),
            "password" => $password,
            "password_confirmation" => $password,
        ]);
        $data = json_decode($signUp->getContent());

        $response = $this->withHeaders([
            "Authorization" => "Bearer $data->token",

        ])->post("/api/ping");

        $response->assertStatus(200);
    }
}
