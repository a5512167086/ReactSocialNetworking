import React, { useEffect, useState } from "react";
import { Row, Col } from "react-bootstrap";
import Topics from "../components/Topics";
import firebase from "../utils/Firebase";
import Post from "../components/Post";
import { useLocation } from "react-router";

export default function PostsPage() {
  const [posts, setPosts] = useState([]);
  const location = useLocation();
  const urlSearchParams = new URLSearchParams(location.search);
  const currentTopic = urlSearchParams.get("topic");

  useEffect(() => {
    if (currentTopic) {
      firebase
        .firestore()
        .collection("posts")
        .where("topic", "==", currentTopic)
        .get()
        .then((snapshot) => {
          const data = snapshot.docs.map((docSnapshot) => {
            const id = docSnapshot.id;
            return { ...docSnapshot.data(), id };
          });
          setPosts(data);
        });
    } else {
      firebase
        .firestore()
        .collection("posts")
        .orderBy("postTime", "desc")
        .get()
        .then((snapshot) => {
          const data = snapshot.docs.map((docSnapshot) => {
            const id = docSnapshot.id;
            return { ...docSnapshot.data(), id };
          });
          setPosts(data);
        });
    }
  }, [currentTopic]);

  return (
    <div className="mt-5">
      <Row>
        <Col className="d-flex">
          <Topics />
        </Col>
        <Col className="d-flex justify-content-center">
          <Col>
            {posts.map((post) => {
              return <Post post={post} />;
            })}
          </Col>
        </Col>
        <Col></Col>
      </Row>
    </div>
  );
}
