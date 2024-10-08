#ifndef NODE_LIBPQ_CONNECT_ASYNC_WORKER
#define NODE_LIBPQ_CONNECT_ASYNC_WORKER

#include <nan.h>

class Connection;

class ConnectAsyncWorker : public Nan::AsyncWorker {
public:
  ConnectAsyncWorker(v8::Local<v8::String> paramString, Connection* conn, Nan::Callback* callback);
  ~ConnectAsyncWorker();
  void Execute();
  void HandleOKCallback();

private:
  Connection* conn;
  Nan::Utf8String paramString;
};

#endif
