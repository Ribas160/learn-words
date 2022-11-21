<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\Items;

class ItemsController extends Controller
{
    
    
    public function createItem(Request $request)
    {
        $fields = $request->toArray();

        $validator = Validator::make($fields, [
            'lang1' => 'required|string',
            'lang2' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors()->first(), 400);
        }

        $items = new Items();
        $itemId = $items->createItem($request->listId, [
            'lang1' => $fields['lang1'], 
            'lang2' => $fields['lang2']
        ]);

        if (!$itemId) {
            return response()->json(['message' => "New item has not been created"], 500);
        }

        return response()->json(["id" => $itemId], 201);
    }


    public function createItemsCSV(Request $request)
    {
        $fields = $request->toArray();

        if (!isset($fields['file'])) {
            response()->json(["message" => "File is required"], 400);
        }

        if (!in_array($fields['file']->getMimeType(), ["text/plain", "text/csv"])) {
            response()->json(["message" => "The file must be a file of type: text/plain, text/csv"], 400);
        }

        $items = new Items();
        $itemsId = [];

        $file = file($fields['file']->getRealPath());
        

        foreach($file as $key => $line) {
            $fileData = str_getcsv($line);

            if (count($fileData) < 2) {
                return response()->json(['message' => "Invalid file data format"], 400);
            }

            $itemId = $items->createItem($request->listId, [
                'lang1' => $fileData[0],
                'lang2' => $fileData[1],
            ]);
    
            if (!$itemId) {
                return response()->json(['message' => ($key + 1) . " item has not been created"], 500);
            }

            $itemsId[] = $itemId;
        }

        return response()->json(["ids" => $itemsId], 201);
    }

    
    public function getAllItems(Request $request)
    {
        $items = new Items();
        $allItems = $items->getAllItems($request->user()->id, $request->listId);

        if (is_null($allItems)) {
            return response()->json(["message" => "Items has not been found"], 404);
        }

        return response()->json($allItems, 200);
    }

    
    public function getItemById(Request $request)
    {
        $items = new Items();
        $itemById = $items->getItemById($request->user()->id, $request->itemId);

        if (is_null($itemById)) {
            return response()->json(["message" => "Item has not been found"], 404);
        }

        return response()->json($itemById, 200);
    }

    
    public function updateItem(Request $request)
    {
        $fields = $request->toArray();

        $validator = Validator::make($fields, [
            'lang1' => 'string',
            'lang2' => 'string',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors()->first(), 400);
        }

        $items = new Items();
        $updated = $items->updateItem($request->user()->id, $request->itemId, $fields);

        if ($updated !== 1) {
            return response()->json(["message" => "Item has not been updated"], 500);
        }

        return response()->noContent(204);
    }

    
    public function deleteItem(Request $request)
    {
        $items = new Items();
        $deleted = $items->deleteItem($request->user()->id, $request->itemId);

        if ($deleted !== 1) {
            return response()->json(["message" => "Item has not been deleted"], 500);
        }

        return response()->noContent(204);
    }
}
