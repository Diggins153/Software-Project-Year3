"use client";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormRootMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { updateCharacter } from "@/lib/actions/characters";
import { EditCharacterFormSchema } from "@/lib/formSchemas";
import { Character, UpdateCharacter } from "@/types/Character";
import { Race } from "@/types/Race";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

export default function EditCharacterForm({ character, races, onSubmit }: {
    character: Character,
    races: Race[],
    onSubmit?(): void
}) {
    const router = useRouter();
    const form = useForm<z.infer<typeof EditCharacterFormSchema>>({
        resolver: zodResolver(EditCharacterFormSchema),
        defaultValues: {
            id: character.id,
            name: character.name,
            handle: character.handle,
            image: "",
            raceId: character.race_id,
        },
    });
    const imageRef = form.register("image");

    async function handleUpdateCharacter(data: z.infer<typeof EditCharacterFormSchema>) {
        const { name, handle, image, raceId } = data;

        form.setError("root", { type: z.ZodIssueCode.custom, message: "Hi" });

        const newCharacterData: UpdateCharacter = { id: character.id };
        if (name !== character.name) newCharacterData.name = name;
        if (handle !== character.handle) newCharacterData.handle = handle;
        // TODO: Image
        if (raceId !== character.race_id) newCharacterData.race_id = raceId;

        const response = await updateCharacter(character.id, newCharacterData);

        if (response.ok) {
            router.refresh();
        } else {
            toast.error(response.message);
        }
    }

    return <Form { ...form }>
        <form onSubmit={ form.handleSubmit(handleUpdateCharacter) } className="space-y-8">
            <input type="hidden" name="id" value={ character.id }/>

            <FormField
                control={ form.control }
                name="name"
                render={ ({ field }) =>
                    <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                            <Input { ...field }/>
                        </FormControl>
                        <FormMessage/>
                    </FormItem>
                }
            />

            <FormField
                control={ form.control }
                name="handle"
                render={ ({ field }) =>
                    <FormItem>
                        <FormLabel>Handle</FormLabel>
                        <FormControl>
                            <Input { ...field }/>
                        </FormControl>
                        <FormDescription>
                            Your handle will be @{ form.getValues("handle").toLowerCase().replaceAll(/(?![a-z0-9-]+)./g, "") }
                        </FormDescription>
                        <FormMessage/>
                    </FormItem>
                }
            />

            <FormField
                control={ form.control }
                name="raceId"
                render={ ({ field }) =>
                    <FormItem>
                        <FormLabel>Race</FormLabel>
                        <Select onValueChange={ field.onChange } defaultValue={ field.value.toString() }>
                            <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Race"/>
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                { races.map(race =>
                                    <SelectItem
                                        key={ race.id }
                                        value={ race.id.toString() }
                                    >
                                        { race.name }
                                    </SelectItem>) }
                            </SelectContent>
                        </Select>
                        <FormMessage/>
                    </FormItem>
                }
            />

            <FormField
                control={ form.control }
                name="image"
                render={ () =>
                    <FormItem>
                        <FormLabel>Image</FormLabel>
                        <FormControl>
                            <Input type="file" { ...imageRef }/>
                        </FormControl>
                        <FormMessage></FormMessage>
                    </FormItem>
                }
            />

            <div className="flex justify-end">
                <Button type="submit">Save Changes</Button>
            </div>
        </form>
    </Form>;
}