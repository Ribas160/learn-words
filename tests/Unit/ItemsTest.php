<?php

namespace Tests\Unit;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use App\Models\User;
use App\Models\Lists;
use App\Models\Items;

class ItemsTest extends TestCase
{
    
    use RefreshDatabase, WithFaker;
    
    public function testCreateItemSuccess(): void
    {
        $user = User::factory()->create();

        $lists = new Lists();
        $newListId = $lists->createList($user->id, $this->faker()->title());

        $items = new Items();
        $newItemId = $items->createItem($newListId, [
            "lang1" => $this->faker()->word(), 
            "lang2" => $this->faker()->word(),
        ]);

        $this->assertGreaterThan(0, $newItemId);
    }


    public function testCreateItemFailed(): void 
    {
        $items = new Items();
        $itemId = $items->createItem(0, [
            "lang1" => $this->faker()->word(), 
            "lang2" => $this->faker()->word(),
        ]);

        $this->assertEquals(0, $itemId);
    }


    public function testGetAllItems(): void 
    {
        $user1 = User::factory()->create();
        $user2 = User::factory()->create();

        $lists = new Lists();
        $newListId1 = $lists->createList($user1->id, $this->faker()->title());
        $newListId2 = $lists->createList($user2->id, $this->faker()->title());

        $items = new Items();
        $items->createItem($newListId1, [
            "lang1" => $this->faker()->word(), 
            "lang2" => $this->faker()->word(),
        ]);
        $items->createItem($newListId2, [
            "lang1" => $this->faker()->word(), 
            "lang2" => $this->faker()->word(),
        ]);
        $items->createItem($newListId2, [
            "lang1" => $this->faker()->word(), 
            "lang2" => $this->faker()->word(),
        ]);

        $result = $items->getAllItems($user2->id, $newListId2);

        $this->assertEquals(2, count($result));
    }


    public function testGetItemById(): void 
    {
        $user = User::factory()->create();

        $lists = new Lists();
        $newListId = $lists->createList($user->id, $this->faker()->title());

        $items = new Items();
        $newItemId = $items->createItem($newListId, [
            "lang1" => $this->faker()->word(), 
            "lang2" => $this->faker()->word(),
        ]);

        $item = $items->getItemById($user->id, $newItemId);

        $this->assertEquals($newItemId, $item->id);
    }


    public function testUpdateItem(): void 
    {
        $user = User::factory()->create();

        $lists = new Lists();
        $newListId = $lists->createList($user->id, $this->faker()->title());

        $items = new Items();
        $newItemId = $items->createItem($newListId, [
            "lang1" => $this->faker()->word(), 
            "lang2" => $this->faker()->word(),
        ]);

        $newWords = [
            "lang1" => $this->faker()->word(), 
            "lang2" => $this->faker()->word(),
        ];

        $result = $items->updateItem($user->id, $newItemId, $newWords);
        
        $item = $items->getItemById($user->id, $newItemId);

        $this->assertEquals(1, $result);
        $this->assertEquals(
            [$newWords["lang1"], $newWords["lang2"]], 
            [$item->lang1, $item->lang2],
        );
    }


    public function testDeleteItem(): void 
    {
        $user = User::factory()->create();

        $lists = new Lists();
        $newListId = $lists->createList($user->id, $this->faker()->title());

        $items = new Items();
        $newItemId = $items->createItem($newListId, [
            "lang1" => $this->faker()->word(), 
            "lang2" => $this->faker()->word(),
        ]);

        $result = $items->deleteItem($user->id, $newItemId);
        
        $item = $items->getItemById($user->id, $newItemId);

        $this->assertEquals(1, $result);
        $this->assertNull($item);
    }


    public function testItemExists(): void 
    {
        $user = User::factory()->create();

        $lists = new Lists();
        $newListId = $lists->createList($user->id, $this->faker()->title());

        $lang1 = $this->faker()->word();
        $lang2 = $this->faker()->word();

        $items = new Items();
        $items->createItem($newListId, [
            "lang1" => $lang1, 
            "lang2" => $lang2,
        ]);

        $result = $items->itemExists($lang1, $lang2);

        $this->assertTrue($result);
    }
}
