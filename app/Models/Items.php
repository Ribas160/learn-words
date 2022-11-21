<?php

namespace App\Models;

use \Exception;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class Items extends Model
{
    protected $guarded = [];


    public function createItem(int $listId, array $params): int
    {
        DB::beginTransaction();

        try {
            $item = Items::create($params);

            DB::table('lists_items')->insert([
                'list_id' => $listId,
                'item_id' => $item->id,
            ]);

        } catch (Exception $e) {
            DB::rollBack();

            return 0;

        }

        DB::commit();

        return $item->id;
    }


    public function getAllItems(int $userId, int $listId): ?object
    {
        return DB::table("items")
                            ->join("lists_items", "items.id", "lists_items.item_id")
                            ->join("users_lists", "lists_items.list_id", "users_lists.list_id")
                            ->select("items.*")
                            ->where("lists_items.list_id", $listId)
                            ->where("users_lists.user_id", $userId)
                            ->get();
    }


    public function getItemById(int $userId, int $itemId): ?object
    {
        return DB::table("items")
                            ->join("lists_items", "items.id", "lists_items.item_id")
                            ->join("users_lists", "lists_items.list_id", "users_lists.list_id")
                            ->select("items.*")
                            ->where("items.id", $itemId)
                            ->where("users_lists.user_id", $userId)
                            ->first();

    }


    public function updateItem(int $userId, int $itemId, array $params): int
    {
        return DB::table("items")
                            ->join("lists_items", "items.id", "lists_items.item_id")
                            ->join("users_lists", "lists_items.list_id", "users_lists.list_id")
                            ->where("items.id", $itemId)
                            ->where("users_lists.user_id", $userId)
                            ->update($params);
    }


    public function deleteItem(int $userId, int $itemId): int
    {
        return DB::table("items")
                            ->join("lists_items", "items.id", "lists_items.item_id")
                            ->join("users_lists", "lists_items.list_id", "users_lists.list_id")
                            ->where("items.id", $itemId)
                            ->where("users_lists.user_id", $userId)
                            ->delete();
    }
}
