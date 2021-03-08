import AddPost from "components/admin/AddPost";
import Layout from "components/Layout/Layout";

const NewPost = () => {
  return (
    <Layout requireUser>
      <AddPost />
    </Layout>
  );
};

export default NewPost;
