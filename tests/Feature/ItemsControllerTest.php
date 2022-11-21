<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Http\UploadedFile;
use Tests\TestCase;
use App\Models\Items;

class ItemsControllerTest extends TestCase
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


    private function createList(string $token): int 
    {
        $response = $this->withHeaders([
            "Authorization" => "Bearer $token",

        ])->post("/api/lists", [
            "title" => $this->faker()->title(),
        ]);

        $data = json_decode($response->getContent());

        return $data->id;
    }


    public function testCreateItem(): void 
    {
        $signUpData = $this->signUp();
        $listId = $this->createList($signUpData->token);

        $response = $this->withHeaders([
            "Authorization" => "Bearer $signUpData->token",

        ])->post("/api/lists/$listId/items", [
            "lang1" => $this->faker()->word(),
            "lang2" => $this->faker()->word(),
        ]);
        
        $response->assertStatus(201);
    }


    public function testCreateItemsCSV(): void 
    {
        $signUpData = $this->signUp();
        $listId = $this->createList($signUpData->token);

        $csvString = "";
        for ($i=0; $i < 4; $i++) { 
            $csvString .= implode(",", [$this->faker()->word(), $this->faker()->word()]);
            $csvString .= "\r\n";
        }

        $file = UploadedFile::fake()->createWithContent("file.csv", $csvString);

        $response = $this->withHeaders([
            "Authorization" => "Bearer $signUpData->token",

        ])->post("/api/lists/$listId/items/file", [
            "file" => $file,
        ]);

        file_put_contents("/Applications/XAMPP/xamppfiles/htdocs/projects/tmp/temp.html", $response->getContent());
        
        $response->assertStatus(201);
    }


    public function testGetAllItems(): void 
    {
        $signUpData = $this->signUp();
        $listId = $this->createList($signUpData->token);

        $items = new Items();
        $items->createItem($listId, [
            "lang1" => $this->faker()->word(),
            "lang2" => $this->faker()->word(),
        ]);

        $items->createItem($listId, [
            "lang1" => $this->faker()->word(),
            "lang2" => $this->faker()->word(),
        ]);

        $response = $this->withHeaders([
            "Authorization" => "Bearer $signUpData->token",

        ])->get("/api/lists/$listId/items");

        $response->assertStatus(200);
    }


    public function testGetItemById(): void
    {
        $signUpData = $this->signUp();
        $listId = $this->createList($signUpData->token);

        $items = new Items();
        $newItemId = $items->createItem($listId, [
            "lang1" => $this->faker()->word(),
            "lang2" => $this->faker()->word(),
        ]);

        $response = $this->withHeaders([
            "Authorization" => "Bearer $signUpData->token",

        ])->get("/api/items/$newItemId");

        $response->assertStatus(200);
    }


    public function testUpdateItem(): void 
    {
        $signUpData = $this->signUp();
        $listId = $this->createList($signUpData->token);

        $items = new Items();
        $newItemId = $items->createItem($listId, [
            "lang1" => $this->faker()->word(),
            "lang2" => $this->faker()->word(),
        ]);

        $newLang1 = $this->faker()->word();

        $response = $this->withHeaders([
            "Authorization" => "Bearer $signUpData->token",

        ])->put("/api/items/$newItemId", [
            "lang1" => $newLang1,
        ]);

        $updatedItem = $items->getItemById($signUpData->user->id, $newItemId);

        $response->assertStatus(204);
        $this->assertEquals($newLang1, $updatedItem->lang1);
    }


    public function testDeleteItem(): void 
    {
        $signUpData = $this->signUp();
        $listId = $this->createList($signUpData->token);

        $items = new Items();
        $newItemId = $items->createItem($listId, [
            "lang1" => $this->faker()->word(),
            "lang2" => $this->faker()->word(),
        ]);

        $response = $this->withHeaders([
            "Authorization" => "Bearer $signUpData->token",

        ])->delete("/api/items/$newItemId");

        $deletedItem = $items->getItemById($signUpData->user->id, $newItemId);
        
        $response->assertStatus(204);
        $this->assertNull($deletedItem);
    }
}
