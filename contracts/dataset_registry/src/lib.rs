#![no_std]

use soroban_sdk::{contractimpl, contracttype, symbol_short, vec, Bytes, BytesN, Env, String, Symbol, Val, Vec};

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct Dataset {
    pub dataset_id: String,
    pub name: String,
    pub owner: BytesN<32>,
    pub file_hash: Bytes,
    pub version: u32,
    pub timestamp: u64,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct DatasetVersion {
    pub version: u32,
    pub file_hash: Bytes,
    pub timestamp: u64,
    pub change_description: String,
}

pub struct DatasetRegistryContract;

#[contractimpl]
impl DatasetRegistryContract {
    /// Register a new dataset on the blockchain
    pub fn register_dataset(
        env: Env,
        dataset_id: String,
        name: String,
        owner: BytesN<32>,
        file_hash: Bytes,
    ) -> Dataset {
        // Verify caller is the owner
        owner.verify_and_consume_nonce(&owner, &BigInt::zero(&env));

        let dataset = Dataset {
            dataset_id: dataset_id.clone(),
            name,
            owner: owner.clone(),
            file_hash: file_hash.clone(),
            version: 1,
            timestamp: env.ledger().timestamp(),
        };

        // Store dataset in contract storage
        let key = Symbol::new(&env, "dataset");
        env.storage().set(&key, &dataset);

        // Emit event
        env.events().publish(
            (Symbol::new(&env, "dataset_registered"),),
            (dataset_id, owner),
        );

        dataset
    }

    /// Retrieve a dataset by ID
    pub fn get_dataset(env: Env, dataset_id: String) -> Option<Dataset> {
        let key = Symbol::new(&env, "dataset");
        env.storage().get(&key)
    }

    /// Update dataset with new version
    pub fn update_dataset(
        env: Env,
        dataset_id: String,
        owner: BytesN<32>,
        new_file_hash: Bytes,
        change_description: String,
    ) -> Dataset {
        // Verify caller is the owner
        owner.verify_and_consume_nonce(&owner, &BigInt::zero(&env));

        let key = Symbol::new(&env, "dataset");
        let mut dataset: Dataset = env.storage().get(&key).unwrap();

        // Verify ownership
        if dataset.owner != owner {
            panic!("Unauthorized: Only dataset owner can update");
        }

        // Create new version
        dataset.version += 1;
        dataset.file_hash = new_file_hash.clone();
        dataset.timestamp = env.ledger().timestamp();

        // Update storage
        env.storage().set(&key, &dataset);

        // Emit event
        env.events().publish(
            (Symbol::new(&env, "dataset_updated"),),
            (dataset_id, dataset.version),
        );

        dataset
    }

    /// Verify dataset integrity
    pub fn verify_dataset(
        env: Env,
        dataset_id: String,
        provided_hash: Bytes,
    ) -> bool {
        let key = Symbol::new(&env, "dataset");
        
        if let Some(dataset) = env.storage().get::<_, Option<Dataset>>(&key) {
            let is_valid = dataset.file_hash == provided_hash;

            // Emit event
            env.events().publish(
                (Symbol::new(&env, "dataset_verified"),),
                (dataset_id, is_valid),
            );

            is_valid
        } else {
            false
        }
    }

    /// Get dataset version history
    pub fn get_version_history(env: Env, dataset_id: String) -> Vec<DatasetVersion> {
        let key = Symbol::new(&env, "dataset");
        
        if let Some(dataset) = env.storage().get::<_, Option<Dataset>>(&key) {
            let version = DatasetVersion {
                version: dataset.version,
                file_hash: dataset.file_hash,
                timestamp: dataset.timestamp,
                change_description: String::from_slice(&env, "Dataset version"),
            };

            vec![&env, version]
        } else {
            Vec::new(&env)
        }
    }
}
