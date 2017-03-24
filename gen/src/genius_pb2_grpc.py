# Generated by the gRPC Python protocol compiler plugin. DO NOT EDIT!
import grpc
from grpc.framework.common import cardinality
from grpc.framework.interfaces.face import utilities as face_utilities

import genius_pb2 as genius__pb2


class HandshakeStub(object):
  """******************** Handshake Service Entities ********************

  """

  def __init__(self, channel):
    """Constructor.

    Args:
      channel: A grpc.Channel.
    """
    self.Shake = channel.unary_unary(
        '/genius.Handshake/Shake',
        request_serializer=genius__pb2.HandshakeRequest.SerializeToString,
        response_deserializer=genius__pb2.HandshakeResponse.FromString,
        )


class HandshakeServicer(object):
  """******************** Handshake Service Entities ********************

  """

  def Shake(self, request, context):
    context.set_code(grpc.StatusCode.UNIMPLEMENTED)
    context.set_details('Method not implemented!')
    raise NotImplementedError('Method not implemented!')


def add_HandshakeServicer_to_server(servicer, server):
  rpc_method_handlers = {
      'Shake': grpc.unary_unary_rpc_method_handler(
          servicer.Shake,
          request_deserializer=genius__pb2.HandshakeRequest.FromString,
          response_serializer=genius__pb2.HandshakeResponse.SerializeToString,
      ),
  }
  generic_handler = grpc.method_handlers_generic_handler(
      'genius.Handshake', rpc_method_handlers)
  server.add_generic_rpc_handlers((generic_handler,))
