<?php

namespace Tests\Unit;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use App\Models\Lists;
use App\Models\User;


class ListsTest extends TestCase
{

    use RefreshDatabase, WithFaker;


    public function testCreateListSuccess(): void
    {
        $user = User::factory()->create();

        $lists = new Lists();
        $newListId = $lists->createList($user->id, $this->faker()->title());

        $this->assertGreaterThan(0, $newListId);
    }


    public function testCreateListFailed(): void
    {
        $lists = new Lists();
        $newListId = $lists->createList(0, $this->faker()->title());

        $this->assertEquals(0, $newListId);
    }


    public function testGetAllLists(): void
    {
        $user1 = User::factory()->create();
        $user2 = User::factory()->create();

        $lists = new Lists();
        $lists->createList($user1->id, $this->faker()->title());
        $lists->createList($user1->id, $this->faker()->title());
        $lists->createList($user2->id, $this->faker()->title());

        $list = $lists->getAllLists($user1->id);

        $this->assertEquals(2, count($list));
    }


    public function testGetListById(): void
    {
        $user = User::factory()->create();

        $lists = new Lists();
        $newListId = $lists->createList($user->id, $this->faker()->title());

        $listById = $lists->getListById($user->id, $newListId);

        $this->assertNotEmpty($listById);
    }


    public function testUpdateList(): void 
    {
        $user = User::factory()->create();

        $lists = new Lists();
        $newListId = $lists->createList($user->id, $this->faker()->title());

        $newTitle = $this->faker()->title();

        $updated = $lists->updateList($user->id, $newListId, ["title" => $newTitle]);

        $list = $lists->getListById($user->id, $newListId);

        $this->assertEquals(1, $updated);
        $this->assertEquals($newTitle, $list->title);
    }


    public function testDeleteList(): void 
    {
        $user = User::factory()->create();

        $lists = new Lists();
        $newListId = $lists->createList($user->id, $this->faker()->title());

        $deleted = $lists->deleteList($user->id, $newListId);
        
        $list = $lists->getListById($user->id, $newListId);

        $this->assertEquals(1, $deleted);
        $this->assertNull($list);
    }
}
