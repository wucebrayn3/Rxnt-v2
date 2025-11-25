// for post and comment
// strictly show only the data needed. If post, post only without the comments.
// if comment, only the comment and nothing else
// does the same thing for both post and comment
// has transparent background the fills the screen
// actual panel is centered inside the the transparent background

// action: view or edit
// title: nullable for comment, required for post

import axiosInstance from "../axiosInstance";
import { useState, useEffect } from "react";

export default function ItemView ({ action, title, content, id, author, created_at, edited_at }) {

    return (
        
        <div> // transparent
            <div>

            </div>
        </div>
    )

}