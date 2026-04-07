#![no_std]

use soroban_sdk::{contractimpl, contracttype, symbol_short, Bytes, BytesN, Env, String, Symbol, Vec};

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct VerificationRecord {
    pub dataset_id: String,
    pub verifier: BytesN<32>,
    pub provided_hash: Bytes,
    pub is_valid: bool,
    pub timestamp: u64,
}

pub struct DataVerificationContract;

#[contractimpl]
impl DataVerificationContract {
    /// Record a verification check
    pub fn record_verification(
        env: Env,
        dataset_id: String,
        verifier: BytesN<32>,
        provided_hash: Bytes,
        is_valid: bool,
    ) -> VerificationRecord {
        let record = VerificationRecord {
            dataset_id: dataset_id.clone(),
            verifier: verifier.clone(),
            provided_hash: provided_hash.clone(),
            is_valid,
            timestamp: env.ledger().timestamp(),
        };

        // Store verification record
        let key = Symbol::new(&env, &format!("verify_{}", dataset_id));
        env.storage().set(&key, &record);

        // Emit event
        env.events().publish(
            (Symbol::new(&env, "verification_recorded"),),
            (dataset_id, is_valid),
        );

        record
    }

    /// Get verification history for a dataset
    pub fn get_verification_history(env: Env, dataset_id: String) -> Option<VerificationRecord> {
        let key = Symbol::new(&env, &format!("verify_{}", dataset_id));
        env.storage().get(&key)
    }

    /// Check if a hash matches for given dataset
    pub fn verify_hash(
        env: Env,
        dataset_id: String,
        expected_hash: Bytes,
        provided_hash: Bytes,
    ) -> bool {
        expected_hash == provided_hash
    }
}
