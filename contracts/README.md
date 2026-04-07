# Stellar Soroban Smart Contracts

DataGuard Stellar uses two main Stellar Soroban smart contracts written in Rust:

## 1. Dataset Registry Contract (`dataset_registry`)

This contract manages dataset registration, updates, and verification on the blockchain.

### Key Functions

#### `register_dataset`
Registers a new dataset on the blockchain.

```rust
pub fn register_dataset(
    env: Env,
    dataset_id: String,
    name: String,
    owner: BytesN<32>,
    file_hash: Bytes,
) -> Dataset
```

**Parameters:**
- `dataset_id`: Unique identifier for the dataset
- `name`: Human-readable name
- `owner`: Wallet address (32-byte key)
- `file_hash`: SHA-256 hash of the dataset

**Returns:** Dataset structure with version 1

#### `get_dataset`
Retrieves a registered dataset from blockchain.

```rust
pub fn get_dataset(env: Env, dataset_id: String) -> Option<Dataset>
```

#### `update_dataset`
Creates a new version of an existing dataset.

```rust
pub fn update_dataset(
    env: Env,
    dataset_id: String,
    owner: BytesN<32>,
    new_file_hash: Bytes,
    change_description: String,
) -> Dataset
```

#### `verify_dataset`
Verifies if a provided hash matches the blockchain record.

```rust
pub fn verify_dataset(
    env: Env,
    dataset_id: String,
    provided_hash: Bytes,
) -> bool
```

#### `get_version_history`
Retrieves the version history of a dataset.

```rust
pub fn get_version_history(env: Env, dataset_id: String) -> Vec<DatasetVersion>
```

## 2. Data Verification Contract (`data_verification`)

This contract records and retrieves verification checks.

### Key Functions

#### `record_verification`
Records a verification check on-chain.

```rust
pub fn record_verification(
    env: Env,
    dataset_id: String,
    verifier: BytesN<32>,
    provided_hash: Bytes,
    is_valid: bool,
) -> VerificationRecord
```

#### `get_verification_history`
Retrieves verification records for a dataset.

```rust
pub fn get_verification_history(env: Env, dataset_id: String) -> Option<VerificationRecord>
```

#### `verify_hash`
Compares two hashes to verify integrity.

```rust
pub fn verify_hash(
    env: Env,
    dataset_id: String,
    expected_hash: Bytes,
    provided_hash: Bytes,
) -> bool
```

## Building the Contracts

### Prerequisites
- Rust 1.70+
- Soroban CLI

### Build Steps

```bash
# Install Soroban CLI
cargo install --locked soroban-cli

# Build dataset registry
cd contracts/dataset_registry
cargo build --target wasm32-unknown-unknown --release

# Build data verification
cd ../data_verification
cargo build --target wasm32-unknown-unknown --release
```

### Output
- `dataset_registry.wasm` - Compiled dataset registry contract
- `data_verification.wasm` - Compiled verification contract

## Deployment to Stellar Testnet

### 1. Create Stellar Account

```bash
# Generate keypair
soroban keys generate --network testnet my_key

# Get account ID
soroban keys show my_key
```

### 2. Fund Account

Visit [Friendbot](https://laboratory.stellar.org/#account-creator?network=test) and fund your account with test XLM.

### 3. Deploy Contracts

```bash
# Deploy dataset registry
soroban contract deploy \
  --wasm contracts/dataset_registry/target/wasm32-unknown-unknown/release/dataset_registry.wasm \
  --source my_key \
  --network testnet

# Deploy data verification
soroban contract deploy \
  --wasm contracts/data_verification/target/wasm32-unknown-unknown/release/data_verification.wasm \
  --source my_key \
  --network testnet
```

### 4. Note Contract IDs

Save the returned contract IDs (starting with `C`) to your `.env` file:

```env
DATASET_REGISTRY_CONTRACT=C...
DATA_VERIFICATION_CONTRACT=C...
```

## Contract Events

### DatasetRegistryContract

**dataset_registered**
```
Event: ("dataset_registered"), (dataset_id, owner)
```

**dataset_updated**
```
Event: ("dataset_updated"), (dataset_id, version)
```

**dataset_verified**
```
Event: ("dataset_verified"), (dataset_id, is_valid)
```

### DataVerificationContract

**verification_recorded**
```
Event: ("verification_recorded"), (dataset_id, is_valid)
```

## Security Considerations

1. **Owner Verification**: All update operations verify ownership using Stellar signatures
2. **Immutable History**: All versions are permanently stored on blockchain
3. **Hash-based Verification**: Uses SHA-256 hashing for integrity checks
4. **Event Logging**: All operations emit events for audit trails

## Testing

Run contract tests with:

```bash
cargo test --target wasm32-unknown-unknown
```

## More Resources

- [Soroban Documentation](https://developers.stellar.org/learn/smart-contracts)
- [Soroban SDK Reference](https://docs.rs/soroban-sdk/)
- [Stellar Testnet Guide](https://developers.stellar.org/)
