use std::fmt;

#[derive(Debug)]
pub enum Error {
    Io(std::io::Error),
    Http(hyper::Error),
    Json(serde_json::Error),
    Yaml(serde_yaml::Error),
    Reqwest(reqwest::Error),
    Config(String),
    Server(String),
}

impl fmt::Display for Error {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            Error::Io(e) => write!(f, "IO error: {}", e),
            Error::Http(e) => write!(f, "HTTP error: {}", e),
            Error::Json(e) => write!(f, "JSON error: {}", e),
            Error::Yaml(e) => write!(f, "YAML error: {}", e),
            Error::Reqwest(e) => write!(f, "Request error: {}", e),
            Error::Config(e) => write!(f, "Config error: {}", e),
            Error::Server(e) => write!(f, "Server error: {}", e),
        }
    }
}

impl std::error::Error for Error {}

impl From<std::io::Error> for Error {
    fn from(err: std::io::Error) -> Self {
        Error::Io(err)
    }
}

impl From<hyper::Error> for Error {
    fn from(err: hyper::Error) -> Self {
        Error::Http(err)
    }
}

impl From<serde_json::Error> for Error {
    fn from(err: serde_json::Error) -> Self {
        Error::Json(err)
    }
}

impl From<serde_yaml::Error> for Error {
    fn from(err: serde_yaml::Error) -> Self {
        Error::Yaml(err)
    }
}

impl From<reqwest::Error> for Error {
    fn from(err: reqwest::Error) -> Self {
        Error::Reqwest(err)
    }
}

impl From<http::Error> for Error {
    fn from(err: http::Error) -> Self {
        Error::Server(err.to_string())
    }
}

pub type Result<T> = std::result::Result<T, Error>;