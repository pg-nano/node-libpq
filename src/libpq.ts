import bindings from 'bindings'
import { EventEmitter } from 'node:events'
import type { StrictEventEmitter } from 'strict-event-emitter-types'

declare namespace Libpq {
  interface NotifyMsg {
    relname: string
    extra: string
    be_pid: number
  }

  interface ResultError {
    severity: string
    sqlState: string
    messagePrimary: string
    messageDetail?: string
    messageHint?: string
    statementPosition?: string
    internalPosition?: string
    internalQuery?: string
    context?: string
    schemaName?: string
    tableName?: string
    dataTypeName?: string
    constraintName?: string
    sourceFile: string
    sourceLine: string
    sourceFunction: string
  }
}

type LibpqEvents = {
  readable: () => void
  writable: () => void
}

interface Libpq extends StrictEventEmitter<EventEmitter, LibpqEvents> {
  /**
   * Finishes the connection & closes it.
   */
  finish(): void

  /**
   * Returns an int for the fd of the socket.
   */
  socket(): number

  /**
   * Return server version number e.g. 90300.
   */
  serverVersion(): number

  /**
   * Retrieves the last error message from the connection.
   */
  getLastErrorMessage(): string

  /**
   * Describes a prepared query and stores the result.
   *
   * Note: This is a **blocking** call.
   */
  describePrepared(statementName: string): void

  /**
   * Send a command to begin executing a query.
   */
  sendQuery(commandText: string): boolean

  /**
   * Send a command to begin executing a query with parameters.
   */
  sendQueryParams(
    commandText: string,
    parameters: readonly (string | null)[],
  ): boolean

  /**
   * Send a command to prepare a named query.
   */
  sendPrepare(
    statementName: string,
    commandText: string,
    nParams: number,
  ): boolean

  /**
   * Send a command to execute a named query.
   */
  sendQueryPrepared(
    statementName: string,
    parameters: readonly (string | null)[],
  ): boolean

  /**
   * 'Pops' a result out of the buffered response data.
   */
  getResult(): boolean

  /**
   * Returns a text of the enum associated with the result.
   */
  resultStatus(): string

  /**
   * Returns the error message associated with the command, or an empty string
   * if there was no error.
   */
  resultErrorMessage(): string

  /**
   * Retrieves detailed error information from the current result object.
   */
  resultErrorFields(): Libpq.ResultError

  /**
   * Free the memory associated with a result.
   */
  clear(): void

  /**
   * Returns the number of tuples (rows) in the result set.
   */
  ntuples(): number

  /**
   * Returns the number of fields (columns) in the result set.
   */
  nfields(): number

  /**
   * Returns the name of the field (column) at the given offset.
   */
  fname(offset: number): string

  /**
   * Returns the Oid of the table of the field at the given offset.
   */
  ftable(offset: number): number

  /**
   * Returns the column number (within its table) of the field at the given
   * offset.
   */
  ftablecol(offset: number): number

  /**
   * Returns the Oid of the type for the given field.
   */
  ftype(offset: number): number

  /**
   * Returns a text value at the given row/col.
   */
  getvalue(row: number, col: number): string

  /**
   * Returns true/false if the value is null.
   */
  getisnull(row: number, col: number): boolean

  /**
   * Returns the number of parameters of a prepared statement.
   */
  nparams(): number

  /**
   * Returns the data type of the indicated statement parameter (starting from
   * 0).
   */
  paramtype(n: number): number

  /**
   * Returns the status of the command.
   */
  cmdStatus(): string

  /**
   * Returns the number of tuples (rows) affected by the command.
   */
  cmdTuples(): string

  /**
   * Escapes a literal and returns the escaped string.
   */
  escapeLiteral(input: string): string | null

  /**
   * Escapes an identifier and returns the escaped string.
   */
  escapeIdentifier(input: string): string | null

  /**
   * Checks for any notifications which may have arrived.
   */
  notifies(): Libpq.NotifyMsg | undefined

  /**
   * Sends a buffer of binary data to the server.
   *
   * Possible return values:
   * - `1` (if sent successfully)
   * - `0` (if the command would block)
   * - `-1` (if there was an error)
   */
  putCopyData(buffer: Buffer): number

  /**
   * Sends a command to 'finish' the copy.
   *
   * Possible return values:
   * - `1` (if sent successfully)
   * - `0` (if the command would block)
   * - `-1` (if there was an error)
   */
  putCopyEnd(errorMessage?: string): number

  /**
   * Gets a buffer of data from a copy out command.
   *
   * Possible return values:
   * - a `Buffer` (if successful)
   * - `0` (if copy is still in process, async only)
   * - `-1` (if the copy is done)
   * - `-2` (if there was an error)
   */
  getCopyData(async: boolean): Buffer | number

  /**
   * Sets the connection to return results one row at a time.
   */
  setSingleRowMode(): boolean

  /**
   * Starts the 'read ready' libuv socket listener.
   */
  startRead(): void

  /**
   * Suspends the libuv socket 'read ready' listener.
   */
  stopRead(): void

  /**
   * Reads waiting data from the socket.
   */
  consumeInput(): boolean

  /**
   * Returns true if PQ#getResult would cause the process to block waiting on
   * results.
   */
  isBusy(): boolean

  /**
   * Toggles the socket blocking on outgoing writes.
   */
  setNonBlocking(nonBlocking: boolean): boolean

  /**
   * Returns true if the connection is non-blocking on writes, otherwise false.
   */
  isNonBlocking(): boolean

  /**
   * Flushes buffered data to the socket.
   */
  flush(): number

  /**
   * Issues a request to cancel the currently executing query.
   *
   * Returns a string if cancellation fails.
   */
  cancel(): true | string
}

const { PQ } = bindings('addon.node') as { PQ: new () => {} }

class Libpq extends PQ {
  /**
   * Connects to a PostgreSQL backend server process.
   */
  connect(paramString: string) {
    return new Promise<void>((resolve, reject) => {
      PQ.prototype.connect.call(this, paramString, (err?: Error) => {
        if (err) {
          reject(err)
        } else {
          resolve()
        }
      })
    })
  }

  writable(cb: () => void) {
    PQ.prototype.startWrite.call(this)
    return this.once('writable', cb)
  }
}

for (const key in EventEmitter.prototype) {
  PQ.prototype[key] = (EventEmitter.prototype as any)[key]
}

export default Libpq
