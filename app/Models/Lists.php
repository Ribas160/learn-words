<?php

namespace App\Models;

use \Exception;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class Lists extends Model
{
    protected $guarded = [];


    public function createList(int $userId, string $title): int
    {
        DB::beginTransaction();

        try {
            $list = Lists::create([
               'title' => $title,
            ]);

            DB::table('users_lists')->insert([
                'user_id' => $userId,
                'list_id' => $list->id,
            ]);

        } catch (Exception $e) {
            DB::rollBack();

            return 0;

        }

        DB::commit();

        return $list->id;
    }


    public function getAllLists(int $userId): ?object
    {
        return DB::table("lists")
                            ->join("users_lists", "lists.id", "users_lists.list_id")
                            ->select("lists.*")
                            ->where("users_lists.user_id", $userId)
                            ->get();
    }


    public function getListById(int $userId, int $listId): ?object
    {
        return DB::table("lists")
                            ->join("users_lists", "lists.id", "users_lists.list_id")
                            ->select("lists.*")
                            ->where("lists.id", $listId)
                            ->where("users_lists.user_id", $userId)
                            ->first();
    }


    public function updateList(int $userId, int $id, array $params): int
    {
        return DB::table("lists")
                            ->join("users_lists", "lists.id", "users_lists.list_id")
                            ->where("lists.id", $id)
                            ->where("users_lists.user_id", $userId)
                            ->update($params);
    }


    public function deleteList(int $userId, int $listId): int
    {
        return DB::table("lists")
                            ->join("users_lists", "lists.id", "users_lists.list_id")
                            ->where("lists.id", $listId)
                            ->where("users_lists.user_id", $userId)
                            ->delete();
    }
}
