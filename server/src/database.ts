import pg from "pg";
const pool=new pg.Pool(
    {
        //host:"postgres-c-bs",
        host:"localhost",
        port:6800,
        user:"postgres",
        password:"1234",
        database:"b_shop_dev" 
    }
);
export default pool