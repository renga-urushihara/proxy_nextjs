use rocket::serde::{json::Json, Serialize};

#[macro_use]
extern crate rocket;

#[get("/")]
fn index() -> &'static str {
    "Hello, world!"
}

#[derive(Serialize)]
#[serde(crate = "rocket::serde")]
struct Task {
    title: String,
    num: i16,
}

#[get("/ssr")]
fn ssr() -> Json<Task> {
    Json(Task {
        title: "hoge".to_string(),
        num: 20,
    })
}

#[launch]
fn rocket() -> _ {
    rocket::build().mount("/", routes![index, ssr])
}
