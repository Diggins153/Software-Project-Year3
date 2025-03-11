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
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { updateCharacter } from "@/lib/actions/characters";
import { EditCharacterFormSchema } from "@/lib/formSchemas";
import { Character } from "@/types/Character";
import { CharacterClass } from "@/types/CharacterClass";
import { Class } from "@/types/Class";
import { Race } from "@/types/Race";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

export default function EditCharacterForm({ character, characterClasses, races, onSubmit, classes }: {
    character: Character,
    characterClasses: CharacterClass[],
    races: Race[],
    onSubmit?(): void,
    classes: Class[],
}) {
    const router = useRouter();
    const form = useForm<z.infer<typeof EditCharacterFormSchema>>({
        resolver: zodResolver(EditCharacterFormSchema),
        defaultValues: {
            id: character.id,
            name: character.name,
            handle: character.handle,
            image: "https://placehold.co/75.png",
            raceId: character.race_id,
            classId: characterClasses[0].class_id,
            level: characterClasses[0].level,
        },
    });

    // const imageRef = form.register("image");

    async function handleUpdateCharacter(data: z.infer<typeof EditCharacterFormSchema>) {
        const response = await updateCharacter(character.id, data);

        if (response.ok) {
            router.refresh();
            if (!!onSubmit) onSubmit();
        } else {
            toast.error(response.message);
        }
    }

    return <Form { ...form }>
        <form onSubmit={ form.handleSubmit(handleUpdateCharacter) } className="space-y-8">
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
                            Your handle will be
                            @{ form.getValues("handle").toLowerCase().replaceAll(/(?![a-z0-9-]+)./g, "") }
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
                name="classId"
                render={ ({ field }) =>
                    <FormItem>
                        <FormLabel>Class</FormLabel>
                        <Select onValueChange={ field.onChange } defaultValue={ field.value.toString() }>
                            <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Class"/>
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                { classes.map(cClass =>
                                    <SelectItem
                                        key={ cClass.id }
                                        value={ cClass.id.toString() }
                                    >
                                        { cClass.name }
                                    </SelectItem>) }
                            </SelectContent>
                        </Select>
                        <FormMessage/>
                    </FormItem>
                }
            />

            <FormField
                control={ form.control }
                name="level"
                render={ ({ field }) =>
                    <FormItem>
                        <FormLabel>Level</FormLabel>
                        <FormControl>
                            <Input type="number" min="1" max="20" { ...field }/>
                        </FormControl>
                        <FormMessage/>
                    </FormItem>
                }
            />

            {/*<FormField*/ }
            {/*    control={ form.control }*/ }
            {/*    name="image"*/ }
            {/*    render={ () =>*/ }
            {/*        <FormItem>*/ }
            {/*            <FormLabel>Image</FormLabel>*/ }
            {/*            <FormControl>*/ }
            {/*                <Input type="file" { ...imageRef }/>*/ }
            {/*            </FormControl>*/ }
            {/*            <FormMessage></FormMessage>*/ }
            {/*        </FormItem>*/ }
            {/*    }*/ }
            {/*/>*/ }

            <div className="flex justify-end">
                <Button type="submit">Save Changes</Button>
            </div>
        </form>
    </Form>;
}