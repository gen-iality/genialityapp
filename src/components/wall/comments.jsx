import React, { Component } from "react"
import { firestore } from "../../helpers/firebase";
import { Avatar, List, Card, Spin } from "antd";
import TimeStamp from "react-timestamp";


class CommentsList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            avatar: "https://firebasestorage.googleapis.com/v0/b/eviusauth.appspot.com/o/avatar0.png?alt=media&token=26ace5bb-f91f-45ca-8461-3e579790f481",
            dataComment: undefined,
            postId: this.props.postId,
            eventId: this.props.eventId,
            commentsCount: this.props.commentsCount || 0,
        }
    }

    // se obtienen los comentarios, Se realiza la muestra del modal y se envian los datos a dataComment del state
    async getComments(postId, eventId) {
        try {

            let dataComment = [];

            let admincommentsRef = firestore
                .collection("adminPost")
                .doc(eventId)
                .collection("comment")
                .doc(postId)
                .collection("comments")
                .orderBy("date", "desc");

            let snapshot = await admincommentsRef.get();
            dataComment = snapshot.docs.map((doc) => { return { id: doc.id, ...doc.data() } });
            this.setState({ dataComment });

        } catch (err) {
            console.log("Error getting documents", err);
            this.setState({ dataComment: [] });
        };
    }

    async componentDidUpdate(prevProps) {
        if (prevProps.commentsCount !== this.props.commentsCount) {
            this.getComments(this.props.postId, this.props.eventId);
        }
    }

    async componentDidMount() {
        this.getComments(this.props.postId, this.props.eventId);
    }


    render() {
        const { dataComment } = this.state;
        return (
            <div style={{ textAlign: "left" }}>
                {!dataComment && <Spin tip="Loading..." />}

                {dataComment && dataComment.length === 0 && (
                    <Card style={{ display: "block", margin: "0 auto", textAlign: "left", padding: "0px 30px" }}>
                        Aún sin comentarios
                    </Card>
                )}

                {dataComment && dataComment.length > 0 && (

                    <List
                        itemLayout="vertical"

                        // Aqui se llama al array del state
                        dataSource={dataComment}
                        // Aqui se mapea al array del state
                        renderItem={(item) => (
                            <List.Item key={item.id}>
                                <List.Item.Meta
                                    avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                                    title={<span>{item.authorName}</span>}
                                    description={<TimeStamp date={item.date} />}
                                />
                                <div>{item.comment}</div>
                            </List.Item>
                        )}
                    />

                )}
            </div>
        )
    }
}
export default CommentsList