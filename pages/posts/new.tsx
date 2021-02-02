import { AddPosting } from "components/admin/AddPost";
import Layout from "components/Layout/Layout";

const NewPost = () => {
  return (
    <Layout requireUser>
      <AddPosting />
    </Layout>
  );
};

export default NewPost;
