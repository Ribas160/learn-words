<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\Lists;

class ListsController extends Controller
{
    
    
    public function createList(Request $request)
    {
        $fields = $request->toArray();

        $validator = Validator::make($fields, [
            'title' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors()->first(), 400);
        }

        $lists = new Lists();

        $allLists = $lists->getAllLists($request->user()->id);

        foreach ($allLists as $list) {
            if ($list->title === $fields['title']) {
                return response()->json(["message" => "List aready exists"], 409);
            }
        }

        $listId = $lists->createList($request->user()->id, $fields['title']);

        if (!$listId) {
            return response()->json(["message" => "New list has not been created"], 500);
        }

        return response()->json(["id" => $listId], 201);
    }


    public function getAllLists(Request $request)
    {
        $lists = new Lists();
        $allLists = $lists->getAllLists($request->user()->id);

        if (is_null($allLists)) {
            return response()->json(["message" => "Lists has not been found"], 404);
        }

        return response()->json($allLists, 200);
    }


    public function getListById(Request $request)
    {
        $lists = new Lists();
        $listById = $lists->getListById($request->user()->id, $request->listId);

        if (is_null($listById)) {
            return response()->json(["message" => "Lists has not been found"], 404);
        }

        return response()->json($listById, 200);
    }


    public function updateList(Request $request)
    {
        $fields = $request->toArray();

        $validator = Validator::make($fields, [
            'title' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors()->first(), 400);
        }

        $lists = new Lists();
        $updated = $lists->updateList($request->user()->id, $request->listId, ["title" => $fields['title']]);

        if ($updated !== 1) {
            return response()->json(['message' => "List has not been updated"], 500);
        }

        return response()->noContent(204);
    }


    public function deleteList(Request $request)
    {
        $lists = new Lists();
        $deleted = $lists->deleteList($request->user()->id, $request->listId);

        if ($deleted !== 1) {
            return response()->json(["message" => "List has not been deleted"], 500);
        }

        return response()->noContent(204);
    }
}
