<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\Lists;

class ListsControllerTest extends TestCase
{
    use RefreshDatabase, WithFaker;


    private function signUp(): object
    {
        $password = $this->faker()->password();

        $response = $this->post("/api/sign-up", [
            "name" => $this->faker()->name(),
            "email" => $this->faker()->email(),
            "password" => $password,
            "password_confirmation" => $password,
        ]);

        $data = json_decode($response->getContent());

        return $data;
    }


    public function testCreateList(): void 
    {
        $signUpData = $this->signUp();

        $response = $this->withHeaders([
            "Authorization" => "Bearer $signUpData->token",

        ])->post("/api/lists", [
            "title" => $this->faker()->title(),
        ]);
        

        $response->assertStatus(201);
    }


    public function testGetAllLists(): void 
    {
        $signUpData = $this->signUp();

        $lists = new Lists();
        $lists->createList($signUpData->user->id, "Title1");
        $lists->createList($signUpData->user->id, "Title2");

        $response = $this->withHeaders([
            "Authorization" => "Bearer $signUpData->token",

        ])->get("/api/lists");

        $response->assertStatus(200);
    }


    public function testGetListById(): void
    {
        $signUpData = $this->signUp();

        $lists = new Lists();
        $newListId = $lists->createList($signUpData->user->id, "Title");

        $response = $this->withHeaders([
            "Authorization" => "Bearer $signUpData->token",

        ])->get("/api/lists/$newListId");

        $response->assertStatus(200);
    }


    public function testUpdateList(): void 
    {
        $signUpData = $this->signUp();

        $lists = new Lists();
        $newListId = $lists->createList($signUpData->user->id, "Title");

        $response = $this->withHeaders([
            "Authorization" => "Bearer $signUpData->token",

        ])->put("/api/lists/$newListId", [
            "title" => "Home",
        ]);

        $updatedList = $lists->getListById($signUpData->user->id, $newListId);

        $response->assertStatus(204);
        $this->assertEquals("Home", $updatedList->title);
    }


    public function testDeleteList(): void 
    {
        $signUpData = $this->signUp();

        $lists = new Lists();
        $newListId = $lists->createList($signUpData->user->id, "Title");

        $response = $this->withHeaders([
            "Authorization" => "Bearer $signUpData->token",

        ])->delete("/api/lists/$newListId");
        
        $response->assertStatus(204);
    }
}
