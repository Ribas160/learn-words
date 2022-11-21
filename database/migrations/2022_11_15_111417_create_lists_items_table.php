<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateListsItemsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('lists_items', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger("list_id");
            $table->unsignedBigInteger("item_id");
            $table->timestamps();

            $table->foreign("list_id")->references("id")->on("lists")->onDelete("cascade");;
            $table->foreign("item_id")->references("id")->on("items")->onDelete("cascade");;
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('lists_items');
    }
}
