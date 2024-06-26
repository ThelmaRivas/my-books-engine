import { gql } from '@apollo/client';

// Hold the query GET_ME, which will execute the `me` query set up using Apollo Server.
export const GET_ME = gql`
    query me {
        me {
            _id
            username
            email
            bookCount
            savedBooks {
                bookId
                authors
                description
                image
                link
                title
            }
        }
    }
`;