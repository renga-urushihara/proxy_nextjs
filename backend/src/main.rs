use std::time::Duration;

use rocket::{
    http::SameSite,
    serde::{json::Json, Serialize},
};
use rocket_session_store::{memory::MemoryStore, CookieConfig, Session, SessionStore};

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
async fn ssr(session: Session<'_, String>) -> Json<Task> {
    let name = session
        .get()
        .await
        .unwrap()
        .or(Some(String::from("fa")))
        .unwrap();
    session.set(String::from("value")).await.unwrap();
    Json(Task {
        title: name,
        num: 20,
    })
}

#[get("/sync_session")]
async fn sync_session(_session: Session<'_, String>) -> &'static str {
    ""
}

#[launch]
fn rocket() -> _ {
    let memory_store: MemoryStore<String> = MemoryStore::default();
    let store: SessionStore<String> = SessionStore {
        store: Box::new(memory_store),
        name: "token".into(),
        duration: Duration::from_secs(3600 * 24 * 3),
        cookie: CookieConfig {
            path: Some("/".into()),
            same_site: Some(SameSite::Lax),
            secure: true,
            http_only: true,
        },
    };

    rocket::build()
        .attach(store.fairing())
        .mount("/", routes![index, ssr, sync_session])
}
