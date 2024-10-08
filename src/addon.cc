#include "addon.h"

// Initialize the node addon
NAN_MODULE_INIT(InitAddon) {

  v8::Local<v8::FunctionTemplate> tpl = Nan::New<v8::FunctionTemplate>(Connection::Create);
  tpl->SetClassName(Nan::New("PQ").ToLocalChecked());
  tpl->InstanceTemplate()->SetInternalFieldCount(1);

  //connection initialization & management functions
  Nan::SetPrototypeMethod(tpl, "connect", Connection::Connect);
  Nan::SetPrototypeMethod(tpl, "finish", Connection::Finish);
  Nan::SetPrototypeMethod(tpl, "socket", Connection::Socket);
  Nan::SetPrototypeMethod(tpl, "serverVersion", Connection::ServerVersion);
  Nan::SetPrototypeMethod(tpl, "getLastErrorMessage", Connection::GetLastErrorMessage);

  //sync query functions
  Nan::SetPrototypeMethod(tpl, "describePrepared", Connection::DescribePrepared);

  //async query functions
  Nan::SetPrototypeMethod(tpl, "sendQuery", Connection::SendQuery);
  Nan::SetPrototypeMethod(tpl, "sendQueryParams", Connection::SendQueryParams);
  Nan::SetPrototypeMethod(tpl, "sendPrepare", Connection::SendPrepare);
  Nan::SetPrototypeMethod(tpl, "sendQueryPrepared", Connection::SendQueryPrepared);
  Nan::SetPrototypeMethod(tpl, "getResult", Connection::GetResult);

  //result accessor functions
  Nan::SetPrototypeMethod(tpl, "resultStatus", Connection::ResultStatus);
  Nan::SetPrototypeMethod(tpl, "resultErrorMessage", Connection::ResultErrorMessage);
  Nan::SetPrototypeMethod(tpl, "resultErrorFields", Connection::ResultErrorFields);
  Nan::SetPrototypeMethod(tpl, "clear", Connection::Clear);
  Nan::SetPrototypeMethod(tpl, "ntuples", Connection::Ntuples);
  Nan::SetPrototypeMethod(tpl, "nfields", Connection::Nfields);
  Nan::SetPrototypeMethod(tpl, "fname", Connection::Fname);
  Nan::SetPrototypeMethod(tpl, "ftable", Connection::Ftable);
  Nan::SetPrototypeMethod(tpl, "ftablecol", Connection::Ftablecol);
  Nan::SetPrototypeMethod(tpl, "ftype", Connection::Ftype);
  Nan::SetPrototypeMethod(tpl, "getvalue", Connection::Getvalue);
  Nan::SetPrototypeMethod(tpl, "getisnull", Connection::Getisnull);
  Nan::SetPrototypeMethod(tpl, "nparams", Connection::Nparams);
  Nan::SetPrototypeMethod(tpl, "paramtype", Connection::Paramtype);
  Nan::SetPrototypeMethod(tpl, "cmdStatus", Connection::CmdStatus);
  Nan::SetPrototypeMethod(tpl, "cmdTuples", Connection::CmdTuples);

  //string escaping functions
#ifdef ESCAPE_SUPPORTED
  Nan::SetPrototypeMethod(tpl, "escapeLiteral", Connection::EscapeLiteral);
  Nan::SetPrototypeMethod(tpl, "escapeIdentifier", Connection::EscapeIdentifier);
#endif

  //async notifications
  Nan::SetPrototypeMethod(tpl, "notifies", Connection::Notifies);

  //COPY IN/OUT
  Nan::SetPrototypeMethod(tpl, "putCopyData", Connection::PutCopyData);
  Nan::SetPrototypeMethod(tpl, "putCopyEnd", Connection::PutCopyEnd);
  Nan::SetPrototypeMethod(tpl, "getCopyData", Connection::GetCopyData);

  //async i/o control functions
  Nan::SetPrototypeMethod(tpl, "setSingleRowMode", Connection::SetSingleRowMode);
  Nan::SetPrototypeMethod(tpl, "startRead", Connection::StartRead);
  Nan::SetPrototypeMethod(tpl, "stopRead", Connection::StopRead);
  Nan::SetPrototypeMethod(tpl, "startWrite", Connection::StartWrite);
  Nan::SetPrototypeMethod(tpl, "consumeInput", Connection::ConsumeInput);
  Nan::SetPrototypeMethod(tpl, "isBusy", Connection::IsBusy);
  Nan::SetPrototypeMethod(tpl, "setNonBlocking", Connection::SetNonBlocking);
  Nan::SetPrototypeMethod(tpl, "isNonBlocking", Connection::IsNonBlocking);
  Nan::SetPrototypeMethod(tpl, "flush", Connection::Flush);
  Nan::SetPrototypeMethod(tpl, "cancel", Connection::Cancel);

  Nan::Set(target,
      Nan::New("PQ").ToLocalChecked(), Nan::GetFunction(tpl).ToLocalChecked());
}

NODE_MODULE(addon, InitAddon)
