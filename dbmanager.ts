import mysql, { Connection } from 'mysql2';
import { debug } from './logmanager';

import { sql_enabled, sql_host, sql_user, sql_password, sql_port, sql_dbname } from './config.json';

export class DBManager {

    /**
    * Connects to a MySQL Database using credentials from config.json
    * Returns a MySQL Connection instance
    */
    private getConnection(): Connection | null {
        if (!sql_enabled) {
            return null;
        }

        const con = mysql.createConnection({
            host: sql_host,
            user: sql_user,
            password: sql_password,
            port: sql_port,
            database: sql_dbname,
        });

        return con;
    }

    /**
     * Creates the tables in the DB if they don't already exist.
     * @returns Promise<void>
     */
    public async createTables(): Promise<void> {
        if (!sql_enabled) return;
        debug('Creating tables...');
        const conn = this.getConnection()!;
        const sql = 'CREATE TABLE IF NOT EXISTS views (ID INTEGER PRIMARY KEY AUTO_INCREMENT, name VARCHAR(255), viewcount INTEGER);';
        conn.query(sql);
        conn.end();
    }

    /**
     * Increments the page viewcounter in the database
     * @param view pagename
     * @returns Promise<void>
     */
    public async increaseViews(view: string): Promise<void> {
        if (!sql_enabled) return;
        debug(`Increasing views for view ${view}`);

        const oldVal = await this.getViews(view);
        if (oldVal == -1) {
            debug(`increaseViews(): View is not yet in db, inserting ${view}`);
            await this.insertViews(view);
        }

        const conn = this.getConnection()!;
        const sql = 'UPDATE views SET viewcount = viewcount + 1 WHERE name = ?;';
        conn.query(sql, view);
        conn.end();
    }

    /**
     * Inserts a not yet registered view into the database with viewcount 0
     * @param view the page
     * @returns Promise<void>
     */
    private async insertViews(view: string): Promise<void> {
        if (!sql_enabled) return;
        debug(`Inserting view for view ${view}`);
        const conn = this.getConnection()!;
        const sql = 'INSERT INTO views (name, viewcount) VALUES (?, 0);';
        conn.query(sql, view);
        conn.end();
    }

    /**
     * Async function to get the Views a site has. Must be used with await
     * @param {string} view The site to look for
     * @param {import('mysql').Connection} conn open MySQL connection
     * @returns {number} number of views, -1 if page is not yet in the database
     */
    public async getViews(view: string): Promise<number> {
        if (!sql_enabled) return -1;
        const conn = this.getConnection()!;
        const sql = 'SELECT viewcount FROM views WHERE name = ?;';
        const [rows] = await conn.promise().query(sql, view) as any;

        if (typeof rows[0] === 'undefined') {
            debug('getViews(): View is not yet in db');
            conn.end();
            return -1;
        }
        const num = rows[0].viewcount;
        debug(`viewcount for ${view} is ${num}`);
        conn.end();
        return num;
    }
}