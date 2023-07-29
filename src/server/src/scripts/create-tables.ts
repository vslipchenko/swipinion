import {db} from '../data';

const createTables = async (): Promise<void> => {
  try {
    // Synchronize all defined data to the db
    await db.sync();
    console.log('Tables have been successfully created');
  } catch (error) {
    console.error(error);
  } finally {
    // Terminate process to avoid process handling after script was executed
    process.exit();
  }
};

void createTables();
