<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ListsController;
use App\Http\Controllers\ItemsController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

// Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
//     return $request->user();
// });

Route::post("/sign-up", [AuthController::class, "signUp"]);
Route::post("/sign-in", [AuthController::class, "signIn"]);

Route::group(["middleware" => ["auth:sanctum"]], function() {
    Route::post("/logOut", [AuthController::class, "logOut"]);
    Route::post("/ping", [AuthController::class, "ping"]);
    
    Route::prefix("lists")->group(function() {
        Route::post("/", [ListsController::class, "createList"]);
        Route::get("/", [ListsController::class, "getAllLists"]);
        Route::get("/{listId}", [ListsController::class, "getListById"]);
        Route::put("/{listId}", [ListsController::class, "updateList"]);
        Route::delete("/{listId}", [ListsController::class, "deleteList"]);

        Route::prefix("/{listId}/items")->group(function() {
            Route::post("/", [ItemsController::class, "createItem"]);
            Route::post("/file", [ItemsController::class, "createItemsCSV"]);
            Route::get("/", [ItemsController::class, "getAllItems"]);
        });
    });

    Route::prefix("/items")->group(function() {
        Route::get("/{itemId}", [ItemsController::class, "getItemById"]);
        Route::put("/{itemId}", [ItemsController::class, "updateItem"]);
        Route::delete("/{itemId}", [ItemsController::class, "deleteItem"]);
    });
});

Route::any("{any}", function () {
    return response()->json(["message" => "Not found"], 404);
    
})->where("any", ".*");