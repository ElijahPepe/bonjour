import ASCIIFolder from "fold-to-ascii";
import { GuildMember, PartialGuildMember, Util } from "discord.js";
import { useEvent } from "../core";

const foldNickname = async (member: GuildMember) => {
  const { displayName } = member;
  const newName = ASCIIFolder.foldReplacing(displayName);
  if (newName === displayName) {
    return;
  }
  try {
    await member.setNickname(newName.substring(0, 32), "Illegal Nickname");
  } catch {
    await member.setNickname(
      `Illegal Nickname ${Math.floor(1000 + Math.random() * 9000)}`
    );
  }
  await member.send({
    embeds: [
      {
        author: {
          name: member.guild.name,
          iconURL: member.guild.iconURL() ?? undefined,
        },
        title: "Nickname Changed",
        description: `Your display name was found to violate server rules. Your nickname was changed to **${newName}**.`,
        color: Util.resolveColor("BLUE"),
      },
    ],
  });
};

useEvent("guildMemberAdd", foldNickname);
useEvent(
  "guildMemberUpdate",
  (oldMember: GuildMember | PartialGuildMember, newMember: GuildMember) => {
    foldNickname(newMember);
  }
);
