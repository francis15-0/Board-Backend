export interface TaskPatchBody {
  title?: string;
  description?: string;
  status?: "todo" | "doing" | "done";
}


export interface Tasks{
    id : number,
    board_id? : number,
    title? : string,
    description? : string
}