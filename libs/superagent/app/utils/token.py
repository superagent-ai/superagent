from app.utils.api import handle_exception
from app.utils.prisma import prisma

async def obtener_token_supabase(user_id: str):
  try:
    if user_id:
      user_id_with_one = f"{user_id}"
      data = await prisma.token.find_unique(
          where={"apiUserChatwoot": user_id_with_one},
      )
      if data:
        return {"success": True, "data": data}
      else:
        return {"success": False, "message": "Token not found"}
  except Exception as e:
      handle_exception(e)

async def modificar_estado_agente(user_id: str, es_respuesta_de_bot=False):
  try:
    if user_id:
      user_id_with_one = f"{user_id}"
      update_data = await prisma.token.update(
        where={"apiUserChatwoot": user_id_with_one},
        data={"isAgentActive": es_respuesta_de_bot},
      )
      return {"success": True, "data": update_data}
    else:
      return {"success": False, "message": "API User ID is required"}
  except Exception as e:
      print(str(e))
      handle_exception(e)
