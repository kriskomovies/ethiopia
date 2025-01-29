import { Keypair, PublicKey } from '@solana/web3.js';

const PROGRAM_ID = 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA';
const USDC_MINT_ADDRESS = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v';

async function getWalletFromTokenAccount(
  connection: any,
  tokenAccount: string,
) {
  try {
    const accountInfo = await connection.getParsedAccountInfo(
      new PublicKey(tokenAccount),
    );
    if (
      accountInfo.value &&
      accountInfo.value.data &&
      accountInfo.value.data.parsed
    ) {
      return accountInfo.value.data.parsed.info.owner;
    }
  } catch (error) {
    console.error('Error fetching account info:', error);
  }
  return null;
}

export const getTransferDetailsBySignature = async (
  connection: any,
  signatureId: string,
) => {
  try {
    // Fetch the parsed transaction by signature
    const transaction = await connection.getParsedTransaction(signatureId, {
      maxSupportedTransactionVersion: 0,
      commitment: 'finalized',
    });

    if (!transaction) {
      console.log('Transaction not found.');
      return null;
    }

    const receiverDetails: any = [];

    for (const instruction of transaction.transaction.message.instructions) {
      const programId = instruction.programId.toBase58();

      // Check for SPL Token transfers
      if (programId === PROGRAM_ID) {
        const { source, destination, tokenAmount, mint } =
          instruction.parsed.info;

        const solanaWalletPublicKey = await getWalletFromTokenAccount(
          connection,
          destination,
        );
        receiverDetails.push({
          type: 'SPL',
          tokenMint: mint,
          sender: source,
          receiver: solanaWalletPublicKey,
          amount: tokenAmount.uiAmount,
        });
      }
    }

    return receiverDetails;
  } catch (error) {
    console.error('Error fetching USDC transfers:', error);
  }
};

export const createSolanaWallet = () => {
  const keypair = Keypair.generate();
  const publicKey = keypair.publicKey.toString();
  const privateKey = Buffer.from(keypair.secretKey).toString('base64');

  const wallet = {
    publicKey,
    privateKey, // Optionally encrypt this before storing
    walletBalance: 0,
  };

  return wallet;
};
